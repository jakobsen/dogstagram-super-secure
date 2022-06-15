import Feed from "../components/Feed";
import Header from "../components/Header";

interface HomeScreenProps {
  onLogOut: () => void;
}

function HomeScreen({ onLogOut }: HomeScreenProps) {
  return (
    <>
      <Header onLogOut={onLogOut} />
      <Feed />
    </>
  );
}

export default HomeScreen;
