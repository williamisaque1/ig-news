import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/imagens/logo.svg" alt="ig.news"></img>
        <nav>
          <a className={styles.active}>Home</a>
          <a>Post</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
