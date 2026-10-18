import React, { useState } from "react";
import { Step1Type } from "./steps/Step1Type";
import { Step2Metadata } from "./steps/Step2Metadata";
import { Step3Format } from "./steps/Step3Format";
import { Step4Result } from "./steps/Step4Result";
import styles from "./CreateWizard.module.css";

export type TrustType = "self_signed" | "ca_csr";
export type OutputFormat = "pem" | "p12";

export interface WizardState {
  trustType: TrustType | null;
  commonName: string;
  organization: string;
  password?: string;
  format: OutputFormat | null;
}

export const CreateWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState<WizardState>({
    trustType: null,
    commonName: "localhost",
    organization: "",
    password: "password",
    format: null,
  });

  const updateData = (fields: Partial<WizardState>) => {
    setWizardData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    setStep((current) => current + 1);
  };

  const handleBack = () => {
    setStep((current) => current - 1);
  };

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.stepperHeader}>
        <span className={step === 1 ? styles.activeStep : ""}>
          1. Тип подписи
        </span>
        <span className={step === 2 ? styles.activeStep : ""}>
          2. Метаданные
        </span>
        <span className={step === 3 ? styles.activeStep : ""}>
          3. Формат экспорта
        </span>
        <span className={step === 4 ? styles.activeStep : ""}>4. Готово</span>
      </div>

      <div className={styles.stepContent}>
        {step === 1 && (
          <Step1Type
            type={wizardData.trustType}
            onChange={(type) => updateData({ trustType: type })}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <Step2Metadata
            data={wizardData}
            onChange={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <Step3Format
            format={wizardData.format}
            trustType={wizardData.trustType}
            onChange={(fmt) => updateData({ format: fmt })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <Step4Result
            data={wizardData}
            onReset={() => {
              setStep(1);
              updateData({ trustType: null, format: null });
            }}
          />
        )}
      </div>
    </div>
  );
};
