export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t mt-10 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center">
        <p className="text-center text-lg text-muted-foreground mb-10">
          &copy; {currentYear} KnowYourDepartment. All rights reserved.
        </p>
        <p className="text-center text-md text-muted-foreground">
          developed by Asif,Saheb,Dilkushad,Sababul,Samim
        </p>
      </div>
      
    </footer>
  );
}