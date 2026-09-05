import { ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export function PublicButton({
  to,
  href,
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const classes = `public-button public-button--${variant} ${className}`;
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export function PublicPageIntro({ label, title, children }) {
  return (
    <header className="public-intro public-dark">
      <div className="public-container">
        <p className="public-eyebrow">
          {label} <span aria-hidden="true">/</span> ASFC · Solapur
        </p>
        <div className="public-intro-grid">
          <h1 className="public-display">{title}</h1>
          <div className="public-copy">{children}</div>
        </div>
      </div>
    </header>
  );
}

export function PublicImage({ src, alt, label, className = "", position }) {
  return (
    <figure className={`public-image ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}

export function PublicDataState({ kind = "empty", title, children, onRetry }) {
  return (
    <div
      className={`public-data-state public-data-state--${kind}`}
      role={kind === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <p className="public-eyebrow">
        {kind === "loading"
          ? "Please wait"
          : kind === "error"
            ? "Connection interrupted"
            : "Club archive"}
      </p>
      <h2 className="public-h3">{title}</h2>
      <div className="public-copy">{children}</div>
      {onRetry && (
        <PublicButton onClick={onRetry} variant="secondary">
          <RefreshCw size={16} />
          Try again
        </PublicButton>
      )}
    </div>
  );
}

export function PublicJoin({ title = "Every athlete starts somewhere." }) {
  return (
    <section className="public-section public-light public-join">
      <div className="public-container public-split">
        <div>
          <p className="public-eyebrow">Your next chapter</p>
          <h2 className="public-heading">{title}</h2>
        </div>
        <div>
          <p className="public-copy">
            Visit All Star Fencing Club, meet our coaches and discover whether
            fencing is right for your child.
          </p>
          <div className="public-actions">
            <PublicButton to="/player/register">
              Start Your Fencing Journey <ArrowRight size={17} />
            </PublicButton>
            <PublicButton to="/contact" variant="secondary">
              Contact Us
            </PublicButton>
          </div>
          <p className="public-small mt-6">
            Already an ASFC player?{" "}
            <Link className="public-inline-link" to="/player/login">
              Player Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
