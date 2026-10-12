package fu.se.backend.orchids;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Nationalized;

@Entity
@Table(name = "Orchid", schema = "dbo")
public class Orchid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    private Integer orchidId;

    @NotBlank(message = "Tên hoa lan không được để trống")
    @Size(max = 150, message = "Tên hoa lan tối đa 150 ký tự")
    @Nationalized
    @Column(name = "OrchidName", nullable = false, length = 150)
    private String orchidName;

    @Column(name = "IsNatural", nullable = false)
    private boolean natural;

    @Size(max = 1000, message = "Mô tả tối đa 1000 ký tự")
    @Nationalized
    @Column(name = "OrchidDescription", length = 1000)
    private String orchidDescription;

    @Size(max = 100, message = "Phân loại tối đa 100 ký tự")
    @Nationalized
    @Column(name = "OrchidCategory", length = 100)
    private String orchidCategory;

    @Column(name = "IsAttractive", nullable = false)
    private boolean attractive;

    @Size(max = 1000, message = "URL ảnh tối đa 1000 ký tự")
    @Pattern(regexp = "^(?:https?://[^\\s]+)?$", message = "URL ảnh phải bắt đầu bằng http:// hoặc https://")
    @Column(name = "OrchidURL", length = 1000)
    private String orchidURL;

    public Integer getOrchidId() { return orchidId; }
    public void setOrchidId(Integer orchidId) { this.orchidId = orchidId; }
    public String getOrchidName() { return orchidName; }
    public void setOrchidName(String orchidName) { this.orchidName = orchidName; }
    public boolean isNatural() { return natural; }
    public void setNatural(boolean natural) { this.natural = natural; }
    public String getOrchidDescription() { return orchidDescription; }
    public void setOrchidDescription(String orchidDescription) { this.orchidDescription = orchidDescription; }
    public String getOrchidCategory() { return orchidCategory; }
    public void setOrchidCategory(String orchidCategory) { this.orchidCategory = orchidCategory; }
    public boolean isAttractive() { return attractive; }
    public void setAttractive(boolean attractive) { this.attractive = attractive; }
    public String getOrchidURL() { return orchidURL; }
    public void setOrchidURL(String orchidURL) { this.orchidURL = orchidURL; }
}
