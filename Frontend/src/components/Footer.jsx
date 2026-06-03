function Footer() {
  return (
    <footer id="footer" className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-3 px-4 py-8 text-[13px] text-text-secondary sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 HaloHealth. Semua hak dilindungi.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="transition hover:text-text-primary">
            Kebijakan Privasi
          </a>
          <a href="#" className="transition hover:text-text-primary">
            Bantuan
          </a>
          <a href="#" className="transition hover:text-text-primary">
            Kontak
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
