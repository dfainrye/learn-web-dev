export default function WizardSteps({ currentStep = 3 }) {
  const steps = [1, 2, 3, 4, 5];

  return (
    <section className="wizard-strip" aria-label="Этапы записи">
      <div className="wizard-strip__container">
        {steps.map((stepNumber, index) => {
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          let stepClass = "wizard-step";
          if (isCompleted) stepClass += " wizard-step--completed";
          else if (isCurrent) stepClass += " wizard-step--current";
          else stepClass += " wizard-step--upcoming";

          let trackClass = "wizard-step__track";
          if (isCurrent) trackClass += " wizard-step__track--half";

          return (
            <div className={stepClass} key={stepNumber}>
              <span className="wizard-step__badge">{stepNumber}</span>
              {index < steps.length - 1 && <span className={trackClass}></span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
