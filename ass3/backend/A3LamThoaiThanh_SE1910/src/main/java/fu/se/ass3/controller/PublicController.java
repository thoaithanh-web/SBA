// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.controller;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.service.RoomService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    private final RoomService rooms;

    @GetMapping("/rooms")
    public List<RoomView> rooms(@RequestParam(defaultValue = "") String q,
                               @RequestParam(required = false) LocalDate startDate,
                               @RequestParam(required = false) LocalDate endDate) {
        return rooms.list(q, false, startDate, endDate);
    }

    @GetMapping("/rooms/{id}")
    public RoomView room(@PathVariable int id) {
        return rooms.get(id, false);
    }

    @GetMapping("/room-types")
    public List<TypeView> types() {
        return rooms.types();
    }
}
