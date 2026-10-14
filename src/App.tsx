import { FormEvent, useEffect, useMemo, useState } from "react";

type IconName =
  | "cup"
  | "menu"
  | "search"
  | "arrow"
  | "bean"
  | "sofa"
  | "heart"
  | "instagram"
  | "cart"
  | "minus"
  | "plus";

const images = {
  hero: "https://images.unsplash.com/photo-1558220829-4694a46bb01f?auto=format&fit=crop&w=1800&q=88",
  coffee: "https://images.unsplash.com/photo-1543336179-44da3606afa4?auto=format&fit=crop&w=900&q=85",
  cold: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=85",
  food: "https://images.unsplash.com/photo-1676300184084-de35d56a9a70?auto=format&fit=crop&w=900&q=85",
  cake: "https://images.unsplash.com/photo-1637944220604-c5f28faac604?auto=format&fit=crop&w=900&q=85",
  cafe: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1400&q=88",
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    cup: <><path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a3 3 0 0 1 0 6h-2M7 4c0 1 1 1.2 1 2M11 3c0 1 1 1.2 1 3"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    bean: <><path d="M17.5 6.5c3 3 1.5 8-2 11.5S7 23 4 20s-1.5-8 2-11.5S14.5 3.5 17.5 6.5Z"/><path d="M6 19c3-5 8-4 12-11"/></>,
    sofa: <><path d="M5 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v6H3v-6ZM6 19v2M18 19v2"/></>,
    heart: <path d="M20.8 5.7a5.4 5.4 0 0 0-7.7 0L12 6.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.7Z"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    cart: <><path d="M3 4h2l2 11h10l2-7H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo() {
  return <a className="logo" href="#home" aria-label="Artisan Coffee Shop home">
    <span className="logo-mark"><Icon name="cup" size={27} /></span>
    <span><strong>Artisan</strong><small>Coffee Shop</small></span>
  </a>;
}

const menu = [
  { title: "Signature Latte", category: "Coffee", copy: "Velvety espresso with steamed milk and artisan latte art.", image: images.coffee, price: 5.5 },
  { title: "Vanilla Cold Brew", category: "Non-Coffee", copy: "Slow-steeped, lightly sweetened and served over ice.", image: images.cold, price: 5.25 },
  { title: "Artisan Club", category: "Food", copy: "Toasted sourdough, grilled chicken, greens and house sauce.", image: images.food, price: 8.75 },
  { title: "Chocolate Torte", category: "Specials", copy: "Rich dark chocolate cake with a smooth ganache finish.", image: images.cake, price: 6.25 },
];

const reviews = [
  { quote: "The best coffee I've had in town! The atmosphere is cozy and the staff is super friendly.", name: "Sarah Khan", role: "Regular Customer", initials: "SK" },
  { quote: "Amazing taste, great service and a beautiful place to work.", name: "Ali Raza", role: "Frequent Visitor", initials: "AR" },
  { quote: "Their lattes are perfection! I keep coming back for the vibes and the flavor.", name: "Fatima Noor", role: "Loyal Customer", initials: "FN" },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(0);
  const [panel, setPanel] = useState<"search" | "cart" | null>(null);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderDone, setOrderDone] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pickup" | "delivery">("card");
  const [activeSection, setActiveSection] = useState("home");

  const closeNav = () => setOpen(false);
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = Object.entries(cart).reduce((sum, [index, quantity]) => sum + menu[Number(index)].price * quantity, 0);
  const results = useMemo(() => menu.filter((item) => `${item.title} ${item.category} ${item.copy}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = panel ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [panel]);

  const addItem = (index: number) => {
    setCart((current) => ({ ...current, [index]: (current[index] || 0) + 1 }));
    setOrderDone(false);
  };
  const changeQuantity = (index: number, amount: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[index] || 0) + amount);
      const updated = { ...current, [index]: next };
      if (!next) delete updated[index];
      return updated;
    });
  };
  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderDone(true);
    setCart({});
  };
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactSent(true);
    event.currentTarget.reset();
  };

  return <main>
    <header className="site-header">
      <div className="nav-wrap">
        <Logo />
        <nav className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main navigation">
          {["Home", "Menu", "About", "Gallery", "Contact"].map((item) =>
            <a
              key={item}
              className={activeSection === item.toLowerCase() ? "active" : ""}
              href={`#${item.toLowerCase()}`}
              onClick={() => {
                setActiveSection(item.toLowerCase());
                closeNav();
              }}
            >{item}</a>
          )}
          <button className="mobile-order" onClick={() => { closeNav(); setPanel("cart"); }}>Order Now</button>
        </nav>
        <div className="nav-actions">
          <button className="icon-button search-button" aria-label="Search menu" onClick={() => setPanel("search")}><Icon name="search" /></button>
          <button className="order-button" onClick={() => setPanel("cart")}><Icon name="cart" size={16} /> Order Now {itemCount > 0 && <span className="cart-count">{itemCount}</span>}</button>
          <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><Icon name="menu" size={25} /></button>
        </div>
      </div>
    </header>

    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-content container">
        <p className="eyebrow light">Good coffee. Better days.</p>
        <h1>The Perfect Cup<br />Awaits You</h1>
        <p className="hero-copy">At Artisan, we serve more than just coffee — we serve moments, memories and a better tomorrow.</p>
        <a className="primary-button" href="#menu">Explore Menu</a>
      </div>
    </section>

    <section className="menu-section section" id="menu">
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">Our menu</p>
          <h2>Crafted with Passion</h2>
          <p>From rich espressos to creamy lattes, explore our signature drinks<br className="desktop-break" /> and fresh bites, made for every mood.</p>
        </header>
        <div className="menu-grid">
          {menu.map((item) => <article className="menu-card" key={item.title}>
            <img src={item.image} alt={`${item.title} selection`} />
            <div className="card-body">
              <p className="category">{item.category}</p>
              <div className="item-title"><h3>{item.title}</h3><strong>${item.price.toFixed(2)}</strong></div>
              <p>{item.copy}</p>
              <button className="add-button" onClick={() => addItem(menu.indexOf(item))}>Add to order <Icon name="plus" size={15} /></button>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="about-section" id="about">
      <div className="about-image" role="img" aria-label="Warm, welcoming Artisan coffee shop interior" />
      <div className="about-content">
        <div>
          <p className="eyebrow">About us</p>
          <h2>More Than Just Coffee</h2>
          <p className="about-lead">Artisan Coffee Shop is a cozy space where great coffee, delicious food and good vibes come together. We believe in quality, community and the simple joy of a perfect cup.</p>
          <div className="features">
            {[
              { icon: "bean" as IconName, title: "Premium Quality", copy: "We source only the finest beans." },
              { icon: "sofa" as IconName, title: "Cozy Atmosphere", copy: "A place to relax, work or meet." },
              { icon: "heart" as IconName, title: "Fresh & Local", copy: "Supporting local farmers and makers." },
            ].map((feature) => <div className="feature" key={feature.title}>
              <span><Icon name={feature.icon} /></span>
              <div><h3>{feature.title}</h3><p>{feature.copy}</p></div>
            </div>)}
          </div>
          <a className="small-button" href="#gallery">Learn More</a>
        </div>
      </div>
    </section>

    <section className="reviews section" id="gallery">
      <div className="container">
        <header className="section-heading">
          <p className="eyebrow">Testimonials</p>
          <h2>What Our Customers Say</h2>
          <p>Real people. Real moments. Real coffee love.</p>
        </header>
        <div className="review-grid">
          {reviews.map((item, i) => <article className={`review-card ${i === review ? "selected" : ""}`} key={item.name}>
            <div className="avatar">{item.initials}</div>
            <div><blockquote>“{item.quote}”</blockquote><h3>{item.name}</h3><p>{item.role}</p></div>
          </article>)}
        </div>
        <div className="dots" aria-label="Choose testimonial">
          {reviews.map((_, i) => <button key={i} className={i === review ? "active" : ""} onClick={() => setReview(i)} aria-label={`Show testimonial ${i + 1}`} />)}
        </div>
      </div>
    </section>

    <section className="contact-section section" id="contact">
      <div className="container contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">Visit or say hello</p>
          <h2>Your Table Is Waiting</h2>
          <p>Drop in for your morning ritual or send us a message. We would love to hear from you.</p>
          <dl>
            <div><dt>Location</dt><dd>18 Market Lane, Downtown</dd></div>
            <div><dt>Hours</dt><dd>Mon–Sun, 7:00 AM–9:00 PM</dd></div>
            <div><dt>Call</dt><dd>+1 (555) 014-0228</dd></div>
          </dl>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <div className="field-row">
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
          </div>
          <label>Message<textarea name="message" required rows={4} placeholder="How can we help?" /></label>
          <button className="primary-button" type="submit">Send Message</button>
          {contactSent && <p className="form-success" role="status">Thank you — your message has been received.</p>}
        </form>
      </div>
    </section>

    <footer>
      <div className="container footer-main">
        <Logo />
        <nav aria-label="Footer navigation">
          {["Home", "Menu", "About", "Gallery", "Contact"].map((item) => <a key={item} className={activeSection === item.toLowerCase() ? "active" : ""} href={`#${item.toLowerCase()}`} onClick={() => setActiveSection(item.toLowerCase())}>{item}</a>)}
        </nav>
        <div className="socials">
          <a href="https://instagram.com" aria-label="Instagram"><Icon name="instagram" /></a>
          <a href="mailto:hello@artisancoffee.example" aria-label="Email">@</a>
        </div>
      </div>
      <p className="copyright">© 2026 Artisan Coffee Shop. All rights reserved.</p>
    </footer>

    {panel && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPanel(null)}>
      <section className={`modal ${panel === "cart" ? "cart-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="close-button" onClick={() => setPanel(null)} aria-label="Close">×</button>
        {panel === "search" ? <>
          <p className="eyebrow">Discover your favorite</p>
          <h2 id="modal-title">Search Our Menu</h2>
          <label className="search-field"><Icon name="search" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “latte” or “cake”" /></label>
          <div className="search-results">
            {results.map((item) => {
              const index = menu.indexOf(item);
              return <div className="search-result" key={item.title}>
                <img src={item.image} alt="" />
                <div><small>{item.category}</small><h3>{item.title}</h3><p>${item.price.toFixed(2)}</p></div>
                <button onClick={() => addItem(index)} aria-label={`Add ${item.title}`}><Icon name="plus" /></button>
              </div>;
            })}
            {!results.length && <div className="empty-state"><strong>No menu items found</strong><p>Try another coffee, food or special.</p></div>}
          </div>
        </> : orderDone ? <div className="order-success">
          <span>✓</span>
          <h2 id="modal-title">Order Confirmed</h2>
          <p>{paymentMethod === "card"
            ? "Demo card payment approved. Your fresh order is being prepared."
            : paymentMethod === "delivery"
              ? "Your order is confirmed. Please pay cash when it arrives."
              : "Your order is being prepared. Please pay cash when you collect it."}</p>
          <button className="primary-button" onClick={() => setPanel(null)}>Done</button>
        </div> : <>
          <p className="eyebrow">Freshly made for you</p>
          <h2 id="modal-title">Your Order</h2>
          {!itemCount ? <div className="empty-state cart-empty">
            <Icon name="cart" size={34} /><strong>Your order is empty</strong><p>Add something delicious from our menu.</p>
            <button className="primary-button" onClick={() => { setPanel(null); document.querySelector("#menu")?.scrollIntoView(); }}>Browse Menu</button>
          </div> : <form onSubmit={submitOrder}>
            <div className="cart-items">
              {Object.entries(cart).map(([key, quantity]) => {
                const index = Number(key);
                const item = menu[index];
                return <div className="cart-item" key={item.title}>
                  <img src={item.image} alt="" />
                  <div><h3>{item.title}</h3><p>${item.price.toFixed(2)}</p></div>
                  <div className="quantity">
                    <button type="button" onClick={() => changeQuantity(index, -1)} aria-label={`Remove one ${item.title}`}><Icon name="minus" size={14} /></button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => changeQuantity(index, 1)} aria-label={`Add one ${item.title}`}><Icon name="plus" size={14} /></button>
                  </div>
                </div>;
              })}
            </div>
            <div className="checkout-fields">
              <label>Name<input required placeholder="Name for the order" /></label>
              <label>Phone<input required type="tel" placeholder="+1 555 000 0000" /></label>
            </div>
            <fieldset className="payment-options">
              <legend>Choose payment method</legend>
              <label className={paymentMethod === "card" ? "selected" : ""}>
                <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                <span><strong>Online Card</strong><small>Demo Visa or Mastercard payment</small></span>
                <b>Card</b>
              </label>
              <label className={paymentMethod === "pickup" ? "selected" : ""}>
                <input type="radio" name="payment" checked={paymentMethod === "pickup"} onChange={() => setPaymentMethod("pickup")} />
                <span><strong>Cash on Pickup</strong><small>Pay at the counter when ready</small></span>
                <b>Cash</b>
              </label>
              <label className={paymentMethod === "delivery" ? "selected" : ""}>
                <input type="radio" name="payment" checked={paymentMethod === "delivery"} onChange={() => setPaymentMethod("delivery")} />
                <span><strong>Cash on Delivery</strong><small>Pay when your order arrives</small></span>
                <b>Cash</b>
              </label>
            </fieldset>
            {paymentMethod === "card" && <div className="payment-details">
              <label>Card number<input required inputMode="numeric" pattern="[0-9 ]{15,19}" placeholder="4242 4242 4242 4242" /></label>
              <div className="checkout-fields">
                <label>Expiry<input required placeholder="MM / YY" pattern="(0[1-9]|1[0-2]) / [0-9]{2}" /></label>
                <label>CVV<input required inputMode="numeric" pattern="[0-9]{3,4}" placeholder="123" /></label>
              </div>
              <p className="demo-notice">Demo checkout only — no real charge will be made.</p>
            </div>}
            {paymentMethod === "delivery" && <div className="payment-details">
              <label>Delivery address<textarea required rows={2} placeholder="House, street and area" /></label>
            </div>}
            <div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            <button className="primary-button checkout-button" type="submit">
              {paymentMethod === "card" ? `Pay $${total.toFixed(2)}` : paymentMethod === "delivery" ? "Place Delivery Order" : "Place Pickup Order"}
            </button>
            <p className="secure-note">{paymentMethod === "card" ? "Card details are validated locally for this demo." : "No advance payment required."}</p>
          </form>}
        </>}
      </section>
    </div>}
  </main>;
}
