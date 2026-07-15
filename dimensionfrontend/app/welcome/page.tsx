"use client";
import { useUserSignup } from "@/hooks/apihooks";
import { project_route, workspace_route } from "@/lib/routes";
import { userCredentials_type, userSignup_type } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, {
  useEffect,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
  ReactNode,
} from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface PointerState {
  x: number | null;
  y: number | null;
  active: boolean;
}

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pointer = useRef<PointerState>({ x: null, y: null, active: false });
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let W = 0,
      H = 0,
      dpr = 1;

    function initNodes() {
      const count = Math.max(18, Math.round((W * H) / 26000));
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function resize() {
      if (!canvas || !wrap) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    const LINK_DIST = 130;

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const nodes = nodesRef.current;
      const p = pointer.current;

      for (const n of nodes) {
        if (!prefersReduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;

          if (p.active && p.x !== null && p.y !== null) {
            const dx = p.x - n.x,
              dy = p.y - n.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < 18000) {
              const f = 0.0009;
              n.vx += dx * f * 0.02;
              n.vy += dy * f * 0.02;
            }
          }
          n.vx *= 0.995;
          n.vy *= 0.995;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.22;
            ctx.strokeStyle = `rgba(139,127,240,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (p.active && p.x !== null && p.y !== null) {
        for (const n of nodes) {
          const dx = p.x - n.x,
            dy = p.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            const alpha = (1 - dist / 170) * 0.35;
            ctx.strokeStyle = `rgba(63,209,201,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(243,243,245,0.75)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    }

    resize();
    rafRef.current = requestAnimationFrame(step);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };
    const handlePointerLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener("resize", resize);
    wrap.addEventListener("pointermove", handlePointerMove);
    wrap.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", handlePointerMove);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
    </div>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  invalid?: boolean;
  errorText?: string;
  hintText?: string;
  children: ReactNode;
}

function Field({
  label,
  htmlFor,
  invalid,
  errorText,
  hintText,
  children,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[12.5px] font-medium tracking-wide text-neutral-400"
      >
        {label}
      </label>
      {children}
      {invalid ? (
        <span className="text-[11.5px] text-red-400">{errorText}</span>
      ) : hintText ? (
        <span className="text-[11.5px] text-neutral-500">{hintText}</span>
      ) : null}
    </div>
  );
}

// Full static class strings (not built via string concatenation of partial
// utility names) so Tailwind's JIT scanner picks them both up.
const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-[13px] py-[11px] text-[14.5px] text-neutral-100 outline-none placeholder:text-neutral-600 transition-colors focus:border-[#8B7FF0] focus:bg-neutral-900 focus:ring-2 focus:ring-[#6E62E5]/30";
const inputInvalidClass =
  "w-full rounded-lg border border-red-500 bg-neutral-900 px-[13px] py-[11px] text-[14.5px] text-neutral-100 outline-none placeholder:text-neutral-600 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

type RoleOption =
  | ""
  | "Founder / Executive"
  | "Engineering"
  | "Design"
  | "Product"
  | "Operations"
  | "Other";

interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: string;
  organisation?: string;
  team?: string;
  issue?: number[];
}

type FieldName = keyof userSignup_type;

type FormErrors = Partial<Record<FieldName, boolean>>;

export default function OnboardingPage() {
  const router = useRouter();
  const [values, setValues] = useState<userSignup_type>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    organisation: "",
    role: "",
    team: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends FieldName>(field: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [field]: value }) as userSignup_type);
  }
  // checking the type of password on every stroke
  const password_arr = ["@", "#", "!", "*"];
  const has_special_char =
    password_arr.includes(values.password[values.password.length - 1]) &&
    values.password.length != 0;
  const has_length = values.password.length >= 8;
  const passwordWarning = !has_length
    ? "Password must be at least 8 characters long"
    : !has_special_char
      ? "Password must contain a special character"
      : "Password good to go";
  const singup = useUserSignup();
  function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    const nextErrors: FormErrors = {
      firstname: values.firstname.trim() === "",
      lastname: values.lastname.trim() === "",
      password: !has_length || !has_special_char,
      organisation: values?.organisation?.trim() === "",
      role: values.role === "",
      email: !emailOk,
    };
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    setSubmitted(!hasError);
    singup.mutate(values, {
      onSuccess: () => {
        router.push(project_route);
      },
      onError: () => {
        // pop up some error occured and try again
      },
    });
  }

  return (
    <div className="flex h-screen w-full bg-black font-sans">
      {/* LEFT: FORM */}
      <div className="relative z-[2] flex max-w-[560px] flex-1 flex-col justify-center overflow-y-auto bg-neutral-950 px-[72px] py-16">
        <div className="mb-14 flex items-center gap-2.5">
          <div className="h-[22px] w-[22px] shrink-0 rounded-md bg-gradient-to-br from-[#6E62E5] to-[#3FD1C9]" />
          <div className="text-sm font-semibold tracking-wide text-neutral-100">
            Meridian
          </div>
        </div>

        <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.12em] text-[#3FD1C9]">
          Early access
        </p>

        <h1 className="mb-3 text-[34px] font-semibold leading-[1.15] tracking-tight text-neutral-100">
          Tell us whos joining.
        </h1>

        <p className="mb-10 max-w-[420px] text-[15px] leading-relaxed text-neutral-400">
          A few details so we can set up your workspace and get your team the
          right access from day one.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First name"
              htmlFor="firstname"
              invalid={errors.firstname}
              errorText="First name is required."
            >
              <input
                id="firstname"
                type="text"
                placeholder="Ada"
                autoComplete="given-name"
                value={values.firstname}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  update("firstname", e.target.value)
                }
                className={errors.firstname ? inputInvalidClass : inputClass}
              />
            </Field>
            <Field
              label="Last name"
              htmlFor="lastname"
              invalid={errors.lastname}
              errorText="Last name is required."
            >
              <input
                id="lastname"
                type="text"
                placeholder="Lovelace"
                autoComplete="family-name"
                value={values.lastname}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  update("lastname", e.target.value)
                }
                className={errors.lastname ? inputInvalidClass : inputClass}
              />
            </Field>
          </div>

          <Field
            label="Password"
            htmlFor="password"
            invalid={errors.password}
            errorText={passwordWarning}
            // hintText={passwordWarning}
          >
            <input
              id="password"
              type="password"
              // placeholder="ada@company.com"
              autoComplete="password"
              value={values.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("password", e.target.value)
              }
              className={errors.password ? inputInvalidClass : inputClass}
            />
          </Field>
          <Field
            label="Work email"
            htmlFor="email"
            invalid={errors.email}
            errorText="Enter a valid email address."
            hintText="We'll send your workspace invite here."
          >
            <input
              id="email"
              type="email"
              placeholder="ada@company.com"
              autoComplete="email"
              value={values.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("email", e.target.value)
              }
              className={errors.email ? inputInvalidClass : inputClass}
            />
          </Field>

          <Field
            label="Organisation"
            htmlFor="organisation"
            invalid={errors.organisation}
            errorText="Organisation is required."
          >
            <input
              id="organisation"
              type="text"
              placeholder="Analytical Engines Inc."
              autoComplete="organization"
              value={values.organisation}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("organisation", e.target.value)
              }
              className={errors.organisation ? inputInvalidClass : inputClass}
            />
          </Field>

          <Field
            label="Role"
            htmlFor="role"
            invalid={errors.role}
            errorText="Select a role."
          >
            <select
              id="role"
              value={values.role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                update("role", e.target.value as RoleOption)
              }
              className={`cursor-pointer ${errors.role ? inputInvalidClass : inputClass}`}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option>Founder / Executive</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Product</option>
              <option>Operations</option>
              <option>Other</option>
            </select>
          </Field>

          <button
            type="submit"
            className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#6E62E5] to-[#7A6DE8] px-[18px] py-3 text-[14.5px] font-semibold text-white transition-[filter] hover:brightness-110 active:translate-y-px"
          >
            Request access
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {submitted && (
            <div className="mt-3.5 flex items-center gap-2 rounded-lg border border-[#3FD1C9]/30 bg-[#3FD1C9]/10 px-3.5 py-3 text-[13.5px] text-[#8FEAE3]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#8FEAE3"
                  strokeWidth="1.4"
                />
                <path
                  d="M5 8l2 2 4-4"
                  stroke="#8FEAE3"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Youre on the list — check your inbox shortly.
            </div>
          )}

          <p className="mt-4 text-xs text-neutral-500">
            By continuing you agree to our{" "}
            <a
              href="#"
              className="text-neutral-400 underline underline-offset-2"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-neutral-400 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>

      {/* RIGHT: VISUAL */}
      <div className="relative hidden flex-1 overflow-hidden border-l border-neutral-800 bg-neutral-900 md:block">
        <div
          className="absolute -inset-[20%] z-0 opacity-55 mix-blend-screen blur-[80px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #6E62E5 0%, transparent 45%), radial-gradient(circle at 70% 60%, #3FD1C9 0%, transparent 40%), radial-gradient(circle at 50% 85%, #8B7FF0 0%, transparent 45%)",
            animation: "drift 18s ease-in-out infinite alternate",
          }}
        />

        <ConstellationCanvas />

        <div
          className="absolute inset-0 z-[1] bg-[length:56px_56px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 85%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 45%, black 40%, transparent 85%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, #111114 100%)",
          }}
        />

        <div className="absolute bottom-16 left-1/2 z-[3] w-4/5 max-w-[420px] -translate-x-1/2 text-center">
          <p className="mb-2.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-neutral-400">
            Built for teams in motion
          </p>
          <h2 className="text-[19px] font-medium leading-relaxed tracking-tight text-neutral-100">
            Every node finds its{" "}
            <span className="text-[#3FD1C9]">connection.</span>
          </h2>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(3%,-2%) scale(1.06); }
          100% { transform: translate(-2%,3%) scale(1); }
        }
      `}</style>
    </div>
  );
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiYW5pcnVkaEB6ZWVwdHkuY29tIiwiaWF0IjoxNzg0MTU4Mjc1LCJleHAiOjE3ODY3NTAyNzV9.PIuFKuAH4WcNeUAFPXuTDhwseLUPQrwlhJLy54nlIsg
