// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.service;

import fu.se.ass3.dto.HotelDtos.*;
import fu.se.ass3.entity.RoomInformation;
import fu.se.ass3.repository.*;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {
    private final RoomInformationRepository rooms;
    private final RoomTypeRepository types;
    private final BookingDetailRepository details;

    public List<RoomView> list(String query, boolean staff, LocalDate start, LocalDate end) {
        if ((start == null) != (end == null) || (start != null && !end.isAfter(start))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khoảng ngày không hợp lệ");
        }
        return rooms.findByNumberContainingIgnoreCaseOrderByNumber(query.strip()).stream()
            .filter(room -> staff || room.getStatus() == 1)
            .filter(room -> start == null || details.countOverlaps(room.getId(), 0, start, end) == 0)
            .map(RoomService::view).toList();
    }

    public RoomView get(int id, boolean staff) {
        return rooms.findById(id).filter(room -> staff || room.getStatus() == 1)
            .map(RoomService::view).orElseThrow(RoomService::missing);
    }

    public List<TypeView> types() {
        return types.findAll().stream().map(t -> new TypeView(t.getId(), t.getName(), t.getDescription(), t.getNote())).toList();
    }

    @Transactional
    public RoomView save(Integer id, RoomInput input) {
        RoomInformation room = id == null ? new RoomInformation() : rooms.lockById(id).orElseThrow(RoomService::missing);
        if (rooms.existsByNumberIgnoreCaseAndIdNot(input.number().strip(), id == null ? 0 : id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Số phòng đã tồn tại");
        }
        room.setType(types.findById(input.typeId()).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại phòng không tồn tại")));
        room.setNumber(input.number().strip());
        room.setDescription(input.description());
        room.setCapacity(input.capacity());
        room.setPricePerDay(input.pricePerDay());
        room.setStatus((byte) (input.active() ? 1 : 0));
        return view(rooms.saveAndFlush(room));
    }

    @Transactional
    public void delete(int id) {
        RoomInformation room = rooms.lockById(id).orElseThrow(RoomService::missing);
        if (details.existsByRoomId(id)) {
            room.setStatus((byte) 0);
        } else {
            rooms.delete(room);
        }
    }

    private static RoomView view(RoomInformation r) {
        return new RoomView(r.getId(), r.getNumber(), r.getDescription(), r.getCapacity(), r.getType().getId(),
                            r.getType().getName(), r.getPricePerDay(), r.getStatus() == 1);
    }

    private static ResponseStatusException missing() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng");
    }
}
