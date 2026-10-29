// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.service;
import java.util.Set;
import fu.se.ass2.exception.DomainException;
import org.springframework.data.domain.Pageable;
public final class PagePolicy {
 private PagePolicy(){}
 public static void check(Pageable page,String... allowed){var fields=Set.of(allowed);for(var order:page.getSort())if(!fields.contains(order.getProperty()))throw DomainException.invalid("Unsupported sort field: "+order.getProperty());}
}
