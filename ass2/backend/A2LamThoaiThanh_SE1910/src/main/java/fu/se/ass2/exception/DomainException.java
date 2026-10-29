// Author: Lam Thoai Thanh - CE190169
package fu.se.ass2.exception;

public class DomainException extends RuntimeException {
 private final int status;
 public DomainException(int status,String message){super(message);this.status=status;}
 public int status(){return status;}
 public static DomainException missing(String type,Object id){return new DomainException(404,type+" "+id+" not found");}
 public static DomainException conflict(String message){return new DomainException(409,message);}
 public static DomainException invalid(String message){return new DomainException(400,message);}
}
