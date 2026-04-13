const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export async function playIntro() {
  let i = 0;
  return new Promise((resolve) => {
    const iv = setInterval(() => {
      process.stdout.write(`\r  ${frames[i++ % frames.length]} Loading card...`);
      if (i > frames.length * 3) {
        clearInterval(iv);
        process.stdout.write('\r' + ' '.repeat(30) + '\r');
        resolve();
      }
    }, 80);
  });
}
