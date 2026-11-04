// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.config;

import fu.se.ass3.entity.RoomInformation;
import fu.se.ass3.entity.RoomType;
import fu.se.ass3.repository.*;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class HotelSeed implements CommandLineRunner {
    private final RoomTypeRepository types;
    private final RoomInformationRepository rooms;

    @Override
    @Transactional
    public void run(String... args) {
        if (types.count() != 0) {
            return;
        }
        RoomType standard = type("Standard", "Phòng cơ bản cho một hoặc hai khách");
        RoomType deluxe = type("Deluxe", "Phòng rộng với góc làm việc");
        RoomType family = type("Family", "Phòng gia đình có nhiều giường");
        room("101", standard, 2, "Phòng tầng một, giường đôi", 450000);
        room("102", standard, 2, "Phòng nhìn ra sân trong", 450000);
        room("201", deluxe, 2, "Có ban công và bàn làm việc", 690000);
        room("202", deluxe, 3, "Phòng góc với cửa sổ lớn", 750000);
        room("301", family, 4, "Hai giường đôi cho gia đình", 980000);
        room("302", family, 5, "Có khu vực sinh hoạt riêng", 1150000);
    }

    private RoomType type(String name, String description) {
        RoomType type = new RoomType();
        type.setName(name);
        type.setDescription(description);
        return types.save(type);
    }

    private void room(String number, RoomType type, int capacity, String description, int price) {
        RoomInformation room = new RoomInformation();
        room.setNumber(number);
        room.setType(type);
        room.setCapacity(capacity);
        room.setDescription(description);
        room.setPricePerDay(BigDecimal.valueOf(price));
        rooms.save(room);
    }
}
