// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.config;

import fu.se.ass2.repository.AccountRepository;
import org.springframework.boot.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class LegacyPasswordMigration {
  @Bean
  ApplicationRunner migrateClassroomPasswords(AccountRepository accounts, PasswordEncoder encoder) {
    return args -> {
      for (var account : accounts.findAll()) {
        var raw = account.getAccountPassword();
        if (raw != null && !raw.startsWith("$2")) {
          account.setAccountPassword(encoder.encode(raw));
          accounts.save(account);
        }
      }
    };
  }
}
