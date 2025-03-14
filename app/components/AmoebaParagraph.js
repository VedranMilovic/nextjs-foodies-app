import Image from "next/image";
import styles from "../styles/amoeba.module.css";

export default function AmoebaParagraph({ children, className = "" }) {
  return (
    <div className={`${styles["amoeba-container"]} ${className}`}>
      <Image
        src="/images/amoeba.png"
        alt="Decorative amoeba shape"
        width={50}
        height={50}
        className={styles["amoeba-icon"]}
      />
      <p>{children}</p>
    </div>
  );
}
