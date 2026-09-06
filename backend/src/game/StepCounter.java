package game;

public class StepCounter {

    private int currentStep;

    public StepCounter() {
        currentStep = 0;
    }

    public void resetCount() {
        currentStep = 0;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int step) {
        currentStep = step;
    }

    public int nextStep() {
        return ++currentStep;
    }
}
