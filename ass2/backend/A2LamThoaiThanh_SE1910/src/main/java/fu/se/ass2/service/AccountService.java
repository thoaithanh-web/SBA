// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.service;
import fu.se.ass2.dto.*;
import fu.se.ass2.entity.SystemAccount;
import fu.se.ass2.exception.DomainException;
import fu.se.ass2.repository.*;
import org.springframework.data.domain.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @Transactional(readOnly=true)
public class AccountService {
 private final AccountRepository repository;private final NewsRepository news;private final PasswordEncoder encoder;private final CurrentAccount current;private final SessionRegistry sessions;
 public AccountService(AccountRepository repository,NewsRepository news,PasswordEncoder encoder,CurrentAccount current,SessionRegistry sessions){this.repository=repository;this.news=news;this.encoder=encoder;this.current=current;this.sessions=sessions;}
 public Page<AccountResponse> list(String keyword,Pageable page){PagePolicy.check(page,"accountId","accountName","accountEmail","accountRole");var q=keyword==null?"":keyword.trim();return repository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(q,q,page).map(this::response);}
 public AccountResponse get(short id){return response(find(id));}
 @Transactional public AccountResponse create(AccountRequest r){var a=new SystemAccount();apply(a,r);return response(repository.saveAndFlush(a));}
 @Transactional public AccountResponse update(short id,AccountRequest r){var a=find(id);if(id==current.get().getAccountId()&&r.accountRole()!=1)throw DomainException.conflict("You cannot remove your own administrator role");boolean changed=!a.getAccountRole().equals(r.accountRole())||(r.password()!=null&&!r.password().isBlank());apply(a,r);var out=response(repository.saveAndFlush(a));if(changed)revoke(id);return out;}
 @Transactional public void delete(short id){var a=find(id);if(id==current.get().getAccountId())throw DomainException.conflict("You cannot delete your signed-in account");if(news.existsByCreatedBy_AccountId(id))throw DomainException.conflict("Cannot delete an account that has created news articles");news.clearUpdater(id);repository.delete(a);repository.flush();revoke(id);}
 @Transactional public AccountResponse profile(ProfileRequest r){var a=current.get();uniqueEmail(r.accountEmail(),a.getAccountId());a.setAccountName(r.accountName().trim());a.setAccountEmail(r.accountEmail().trim());if(r.password()!=null&&!r.password().isBlank())a.setAccountPassword(hash(r.password()));return response(repository.saveAndFlush(a));}
 private void apply(SystemAccount a,AccountRequest r){uniqueEmail(r.accountEmail(),a.getAccountId());a.setAccountName(r.accountName().trim());a.setAccountEmail(r.accountEmail().trim());a.setAccountRole(r.accountRole());if(a.getAccountId()==null&&(r.password()==null||r.password().isBlank()))throw DomainException.invalid("Password is required for a new account");if(r.password()!=null&&!r.password().isBlank())a.setAccountPassword(hash(r.password()));}
 private String hash(String password){if(password.length()<6||password.length()>64)throw DomainException.invalid("New passwords must contain 6 to 64 characters");return encoder.encode(password);}
 private void uniqueEmail(String email,Short id){var found=repository.findByAccountEmailIgnoreCase(email.trim());if(found.isPresent()&&!found.get().getAccountId().equals(id))throw DomainException.conflict("Email is already in use");}
 private SystemAccount find(short id){return repository.findById(id).orElseThrow(()->DomainException.missing("Account",id));}
 private AccountResponse response(SystemAccount a){return new AccountResponse(a.getAccountId(),a.getAccountName(),a.getAccountEmail(),a.getAccountRole());}
 private void revoke(short id){for(var principal:sessions.getAllPrincipals())if(principal instanceof UserDetails u&&u.getUsername().equals(Short.toString(id)))for(var session:sessions.getAllSessions(principal,false))session.expireNow();}
}
