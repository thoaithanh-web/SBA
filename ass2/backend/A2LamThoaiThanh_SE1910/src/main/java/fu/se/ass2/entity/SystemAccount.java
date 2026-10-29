// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
@Entity
@Table(name="SystemAccount",schema="dbo")
public class SystemAccount {
    @Id @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="accountSequence") @SequenceGenerator(name="accountSequence",sequenceName="dbo.AccountSequence",allocationSize=1,initialValue=100) @Column(name="AccountID")
    private Short accountId;
    @Nationalized @Column(name="AccountName",length=100)
    private String accountName;
    @Nationalized @Column(name="AccountEmail",length=70)
    private String accountEmail;
    @Column(name="AccountRole")
    private Integer accountRole;
    @Nationalized @Column(name="AccountPassword",length=70)
    private String accountPassword;
    public Short getAccountId() { return accountId; }
    public void setAccountId(Short value) { accountId=value; }
    public String getAccountName() { return accountName; }
    public void setAccountName(String value) { accountName=value; }
    public String getAccountEmail() { return accountEmail; }
    public void setAccountEmail(String value) { accountEmail=value; }
    public Integer getAccountRole() { return accountRole; }
    public void setAccountRole(Integer value) { accountRole=value; }
    public String getAccountPassword() { return accountPassword; }
    public void setAccountPassword(String value) { accountPassword=value; }
}
