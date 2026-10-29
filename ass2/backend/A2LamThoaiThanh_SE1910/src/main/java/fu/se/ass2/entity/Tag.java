// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
@Entity
@Table(name="Tag",schema="dbo")
public class Tag {
    @Id @GeneratedValue(strategy=GenerationType.SEQUENCE,generator="tagSequence") @SequenceGenerator(name="tagSequence",sequenceName="dbo.TagSequence",allocationSize=1,initialValue=100) @Column(name="TagID")
    private Integer tagId;
    @Nationalized @Column(name="TagName",length=50)
    private String tagName;
    @Nationalized @Column(name="Note",length=400)
    private String note;
    public Integer getTagId() { return tagId; }
    public void setTagId(Integer value) { tagId=value; }
    public String getTagName() { return tagName; }
    public void setTagName(String value) { tagName=value; }
    public String getNote() { return note; }
    public void setNote(String value) { note=value; }
}
