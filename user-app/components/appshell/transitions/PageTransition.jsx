import React from "react";

export default function PageTransition({ children }) {
  return (
    <div style={styles.wrapper}>
      {children}
    </div>
  );
}

const styles = {
  wrapper: {
    animation: "fadeIn 0.25s ease-in-out"
  }
};
