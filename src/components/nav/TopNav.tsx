import Img from "../Img";

export default function TopNav() {
  return (
    <div className="xsm:hidden block sticky top-0">
      <Img
        src={"/images/logo.svg"}
        className="mx-auto size-12.5"
        alt="logo image"
      />
    </div>
  );
}
