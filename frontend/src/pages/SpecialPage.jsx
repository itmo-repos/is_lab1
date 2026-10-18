import AverageCard from '../components/special/AverageCard';
import DecreaseCard from '../components/special/DecreaseCard';
import GreaterCard from '../components/special/GreaterCard';
import GroupCard from '../components/special/GroupCard';
import RemoveCard from '../components/special/RemoveCard';

export default function SpecialPage() {
  return (
    <section>
      <h1>Специальные операции</h1>
      <div className="cards">
        <AverageCard />
        <GroupCard />
        <GreaterCard />
        <DecreaseCard />
        <RemoveCard />
      </div>
    </section>
  );
}
