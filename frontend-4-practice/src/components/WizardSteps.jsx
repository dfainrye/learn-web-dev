const STEPS = [
  { number: 1, label: "Выбор мастера" },
  { number: 2, label: "Выбор услуги" },
  { number: 3, label: "Дата и время" },
  { number: 4, label: "Профиль" },
  { number: 5, label: "Подтверждение" },
];

export default function WizardSteps({ currentStep = 3 }) {
  return (
    <section className="wizard-strip" aria-label="Этапы записи">
      <div className="wizard-strip__container">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          let stepClass = "wizard-step";
          if (isCompleted) stepClass += " wizard-step--completed";
          else if (isCurrent) stepClass += " wizard-step--current";
          else stepClass += " wizard-step--upcoming";

          return (
            <div className={stepClass} key={step.number}>
              <div className="wizard-step__item">
                <span className="wizard-step__badge">{step.number}</span>
                <span className="wizard-step__label">{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <span className="wizard-step__track"></span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
