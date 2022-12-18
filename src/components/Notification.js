import React from "react";

const Notification = (props) => {
  const color = {
    color: props.success ? "green" : "red",
  };
  return (
    <div className="notification-container">
      <p className="notification" style={color}>
        {props.notif}
      </p>
    </div>
  );
};

export default Notification;
