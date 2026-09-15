import { nyghtMedium } from '@/app/fonts/fonts';
import { personaConfig } from '@/config/persona.config';
import Image from 'next/image';
import styles from './PausedPage.module.css';

export function PausedPage() {
  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="pause-title">
        <div className={styles.postcard} aria-hidden="true">
          <div className={styles.postcardTop}>
            <span>A NOTE FROM JESSE</span>
            <span>II</span>
          </div>
          <div className={styles.portrait}>
            <div className={styles.halo} />
            <Image src="/frame/jesse-vacation.webp" alt="" width={260} height={260} priority unoptimized />
          </div>
          <span className={styles.sticker}>OUT OF OFFICE</span>
          <p className={nyghtMedium.className}>Gone touching grass.</p>
          <div className={styles.postcardBottom}>
            <span>✳</span>
          </div>
        </div>

        <div className={styles.message}>
          <h1 id="pause-title" className={nyghtMedium.className}>
            A small Intermission
          </h1>
          <p className={styles.description}>
            Even the most optimistic AI needs a breather. JesseGPT is taking a break, so chats are on pause.
          </p>
          <p className={styles.description}>
            We may be back for another round of big ideas and lovingly honest feedback. Until then, keep building!
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>
          Made with <span className={styles.heart}>♥</span> at{' '}
          <a href={personaConfig.footer.creditUrl}>{personaConfig.footer.credit}</a>
        </span>
        <a href={personaConfig.footer.githubRepo}>
          Fork on GitHub<span aria-hidden="true">↗</span>
        </a>
        <span className={styles.signoff}>Stay curious.</span>
      </footer>
    </main>
  );
}
