export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t mt-10 py-6 md:py-8">
      <div className="container flex items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} KnowYourDepartment. All rights reserved.
        </p>
      </div>
    </footer>
  );
}