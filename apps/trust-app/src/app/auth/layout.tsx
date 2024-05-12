const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen items-center justify-center [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,hsl(var(--primary)))]">
      {children}
    </div>
  );
};

export default AuthLayout;
