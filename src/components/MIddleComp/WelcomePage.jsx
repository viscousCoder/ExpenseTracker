import "./Welcome.css";

function WelcomePage() {
  return (
    <div className="welcome-container">
      <div className="logo">
        <h1>Expense Tracker Group</h1>{" "}
        {/* Replace with your logo if available */}
      </div>
      <div className="welcome-text">
        <p>Welcome to the Expense Tracker Group!</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          tincidunt orci eu lacus commodo, ac commodo lorem fermentum. Praesent
          non massa nec urna ultricies aliquam non et arcu. Phasellus eget
          libero tincidunt, facilisis dui eget, hendrerit magna.
        </p>
        <p>
          Duis sit amet quam dapibus, sagittis turpis at, malesuada odio.
          Integer eget magna nec lacus volutpat tempus nec id risus.
        </p>
      </div>
    </div>
  );
}

export default WelcomePage;
