export default function NavDiv({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return <div className="w-full h-16 flex justify-center items-center shadow border-b-2 text-center py-3 hover:bg-fuchsia-200">
        {children}
    </div>
}