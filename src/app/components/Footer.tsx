import style from "../../styles/Footer.module.css";

function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <span>
          To contact me write HERE:
          <a
            style={{ cursor: "pointer", textDecoration: "none" }}
            href="mailto:dimastan18@gmail.com"
          >
            {" "}
            <strong>dimastan18@gmail.com</strong>
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
