import { Link } from "react-router-dom";
import "./style.css";

const SideCard = ({ title, blogs }) => {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="col">
            {blogs.map((item, index) => (
              <div key={index} style={{ marginBottom: "-20px" }} className="row">
                <Link style={{ padding: 0 }} to="/blog/1">
                  <div className="card card-body">
                    <span className="float-right font-weight-bold">{item.date}</span>
                    <h5>{item.title}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideCard;
