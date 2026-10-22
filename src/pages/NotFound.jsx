
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <div className="panel empty-state">
        <SearchX size={40} />
        <strong>Page not found</strong>
        <span>The page you requested does not exist or may have moved.</span>
        <button className="button button-primary" onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Back to dashboard
        </button>
      </div>
    </div>
  );
}
