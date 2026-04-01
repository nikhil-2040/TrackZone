import { Button, Tag } from "antd";

const statusColors = {
  lost: "volcano",
  found: "green",
};

const formatDate = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleDateString();
};

const ItemCard = ({ item, onContact, isOwner, isLogged, hideActions }) => {
  const imageSrc = item.imageData || item.imageUrl || "";
  return (
    <article className="item-card">
      <div className="card-media">
        {imageSrc ? (
          <img src={imageSrc} alt={item.title} />
        ) : (
          <div className="media-fallback">No image</div>
        )}
      </div>
      <div className="card-header">
        <Tag color={statusColors[item.status] || "blue"}>{item.status}</Tag>
        <span className="match-score">
          {item.matchScore !== undefined ? `${Math.round(item.matchScore * 100)}% match` : item.location || ""}
        </span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description || "No description"}</p>
      <div className="card-meta">
        <span>{formatDate(item.lostDate || item.createdAt)}</span>
        {item.location && <span>{item.location}</span>}
      </div>
      {!hideActions && (
        <div className="card-actions">
          {isOwner ? (
            <span className="owner-pill">You posted this</span>
          ) : isLogged ? (
            <Button block ghost type="primary" onClick={onContact}>
              Share contact
            </Button>
          ) : (
            <span className="owner-pill">Login to connect</span>
          )}
        </div>
      )}
    </article>
  );
};

export default ItemCard;
