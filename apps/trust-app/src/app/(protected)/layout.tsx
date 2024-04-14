interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-primary to-secondary-foreground">
      {children}
    </div>
  );
};

export default ProtectedLayout;
