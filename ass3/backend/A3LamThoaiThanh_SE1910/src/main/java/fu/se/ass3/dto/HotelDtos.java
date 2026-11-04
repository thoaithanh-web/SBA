// Author: Lam Thoai Thanh - CE190169

package fu.se.ass3.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class HotelDtos {
    private HotelDtos() {}

    public record Login(@NotBlank @Email @Size(max = 50) String email,
                        @NotBlank @Size(max = 72) String password) {}

    public record Session(String token, String role, String name) {}

    public record CustomerInput(@NotBlank @Size(max = 50) String fullName,
                                @Pattern(regexp = "[+0-9 ()-]{0,12}") String telephone,
                                @NotBlank @Email @Size(max = 50) String email,
                                @PastOrPresent LocalDate birthday,
                                @Size(max = 72) String password,
                                Boolean active) {}

    public record CustomerView(Integer id, String fullName, String telephone, String email,
                               LocalDate birthday, boolean active) {}

    public record TypeView(Integer id, String name, String description, String note) {}

    public record RoomInput(@NotBlank @Size(max = 50) String number,
                            @Size(max = 220) String description,
                            @NotNull @Min(1) @Max(100) Integer capacity,
                            @NotNull @Positive Integer typeId,
                            @NotNull @DecimalMin("0.01") @Digits(integer = 10, fraction = 4) BigDecimal pricePerDay,
                            @NotNull Boolean active) {}

    public record RoomView(Integer id, String number, String description, int capacity,
                           Integer typeId, String typeName, BigDecimal pricePerDay, boolean active) {}

    public record StayInput(@NotNull @Positive Integer roomId, @NotNull LocalDate startDate,
                            @NotNull LocalDate endDate) {}

    public record BookingInput(@Positive Integer customerId,
                               @NotEmpty @Size(max = 20) List<@NotNull @Valid StayInput> details) {}

    public record BookingStatus(@NotNull @Min(0) @Max(2) Integer status) {}

    public record StayView(Integer roomId, String roomNumber, LocalDate startDate, LocalDate endDate,
                           BigDecimal actualPrice) {}

    public record BookingView(Integer id, LocalDate bookingDate, Integer customerId, String customerName,
                              int status, BigDecimal totalPrice, List<StayView> details) {}
}
