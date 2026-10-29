// Author: Lam Thoai Thanh - CE190169
import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-icon">F</span>
      <span>
        FU<span className="brand-light">News</span>
        <small>THE CAMPUS, CONNECTED</small>
      </span>
    </Link>
  );
}
