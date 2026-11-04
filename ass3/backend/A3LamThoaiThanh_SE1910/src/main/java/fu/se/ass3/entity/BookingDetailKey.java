// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.entity;

import java.io.Serializable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingDetailKey implements Serializable {
    private Integer booking;
    private Integer room;
}
