import React from 'react';
import Button from '../Buttons/Button';
import styles from './Footer.module.scss';

function Footer({ onClickLegal, t }) {
  console.log('styles', styles)
  return (
    <footer className={styles.footerMain}>
      <div className={styles.footerInner}>
        <Button
          type="transparent-white"
          typography="capitalize"
          size="small"
          onClick={() => onClickLegal('terms')}
          className={styles.footerLink}
        >
          Terms & Conditions
        </Button>
        <Button
          type="transparent-white"
          typography="capitalize"
          size="small"
          onClick={() => onClickLegal('cookies')}
          className={styles.footerLink}
        >
          Cookies
        </Button>
        <Button
          type="transparent-white"
          typography="capitalize"
          size="small"
          onClick={() => onClickLegal('privacy')}
          className={styles.footerLink}
        >
          Privacy Policy
        </Button>
      </div>
    </footer>
  );
}

export default Footer;