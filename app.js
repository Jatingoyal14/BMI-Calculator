// BMI Calculator Application
class BMICalculator {
    constructor() {
        this.currentUnit = 'metric';
        this.history = [];
        this.maxHistoryItems = 5;
        
        // BMI Categories data
        this.bmiCategories = [
            {
                category: "Underweight",
                range: "< 18.5",
                color: "#3498db",
                description: "You may be underweight. Consider consulting with a healthcare professional about healthy weight gain strategies.",
                tips: [
                    "Eat nutrient-dense foods more frequently",
                    "Include healthy fats in your diet", 
                    "Consider strength training exercises",
                    "Consult with a healthcare provider"
                ]
            },
            {
                category: "Normal weight",
                range: "18.5 - 24.9", 
                color: "#2ecc71",
                description: "You have a healthy weight! Maintain your current lifestyle with balanced nutrition and regular exercise.",
                tips: [
                    "Maintain a balanced diet with variety",
                    "Stay physically active with regular exercise",
                    "Get adequate sleep and manage stress",
                    "Schedule regular health check-ups"
                ]
            },
            {
                category: "Overweight",
                range: "25.0 - 29.9",
                color: "#f39c12", 
                description: "You may be overweight. Consider adopting healthier eating habits and increasing physical activity.",
                tips: [
                    "Focus on portion control",
                    "Increase daily physical activity",
                    "Choose whole foods over processed foods",
                    "Stay hydrated throughout the day"
                ]
            },
            {
                category: "Obese",
                range: "≥ 30.0",
                color: "#e74c3c",
                description: "You may be in the obesity range. It's recommended to consult with a healthcare professional for personalized advice.",
                tips: [
                    "Seek guidance from healthcare professionals",
                    "Start with small, sustainable changes",
                    "Focus on gradual weight loss goals",
                    "Consider joining a support group"
                ]
            }
        ];

        this.init();
    }

    init() {
        console.log('Initializing BMI Calculator...');
        this.bindEvents();
        this.setupInitialState();
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Unit toggle - Handle both radio and label clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('label[for="metric"]') || e.target.id === 'metric') {
                document.getElementById('metric').checked = true;
                this.handleUnitChange('metric');
            } else if (e.target.matches('label[for="imperial"]') || e.target.id === 'imperial') {
                document.getElementById('imperial').checked = true;
                this.handleUnitChange('imperial');
            }
        });

        // Input events
        const inputs = ['height', 'weight', 'heightFt', 'heightIn'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.handleInputChange());
                input.addEventListener('keyup', () => this.handleInputChange());
                input.addEventListener('change', () => this.handleInputChange());
            }
        });

        // Button events
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                console.log('Calculate button clicked');
                this.calculateBMI();
            });
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }

        // History toggle
        const historyToggle = document.getElementById('historyToggle');
        if (historyToggle) {
            historyToggle.addEventListener('click', () => {
                console.log('History toggle clicked');
                this.toggleHistory();
            });
        }
    }

    setupInitialState() {
        console.log('Setting up initial state...');
        const metricRadio = document.getElementById('metric');
        if (metricRadio) {
            metricRadio.checked = true;
        }
        this.currentUnit = 'metric';
        this.updateUnitLabels();
        this.hideResults();
    }

    handleUnitChange(unit) {
        console.log('Unit changed to:', unit);
        this.currentUnit = unit;
        this.updateUnitLabels();
        this.resetInputs();
        this.hideResults();
        this.clearErrors();
    }

    updateUnitLabels() {
        console.log('Updating unit labels for:', this.currentUnit);
        
        const heightLabel = document.getElementById('heightLabel');
        const weightLabel = document.getElementById('weightLabel');
        const heightUnit = document.getElementById('heightUnit');
        const weightUnit = document.getElementById('weightUnit');
        const heightContainer = document.querySelector('.input-container');
        const imperialHeight = document.querySelector('.imperial-height');
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');

        if (this.currentUnit === 'metric') {
            // Show metric inputs
            if (heightLabel) heightLabel.textContent = 'Height (cm)';
            if (weightLabel) weightLabel.textContent = 'Weight (kg)';
            if (heightUnit) heightUnit.textContent = 'cm';
            if (weightUnit) weightUnit.textContent = 'kg';
            if (heightInput) heightInput.placeholder = '170';
            if (weightInput) weightInput.placeholder = '70';
            
            // Show/hide appropriate elements
            if (heightContainer) heightContainer.style.display = 'flex';
            if (imperialHeight) {
                imperialHeight.style.display = 'none';
                imperialHeight.classList.add('hidden');
            }
        } else {
            // Show imperial inputs
            if (heightLabel) heightLabel.textContent = 'Height';
            if (weightLabel) weightLabel.textContent = 'Weight (lbs)';
            if (weightUnit) weightUnit.textContent = 'lbs';
            if (weightInput) weightInput.placeholder = '154';
            
            const heightFt = document.getElementById('heightFt');
            const heightIn = document.getElementById('heightIn');
            if (heightFt) heightFt.placeholder = '5';
            if (heightIn) heightIn.placeholder = '7';
            
            // Show/hide appropriate elements
            if (heightContainer) heightContainer.style.display = 'none';
            if (imperialHeight) {
                imperialHeight.style.display = 'grid';
                imperialHeight.classList.remove('hidden');
            }
        }
    }

    handleInputChange() {
        this.clearErrors();
        
        // Debounced real-time calculation
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            if (this.hasValidInputs()) {
                console.log('Real-time calculation triggered');
                this.calculateBMI(true);
            }
        }, 1000);
    }

    hasValidInputs() {
        if (this.currentUnit === 'metric') {
            const height = this.getNumericValue('height');
            const weight = this.getNumericValue('weight');
            return height > 0 && weight > 0;
        } else {
            const heightFt = this.getNumericValue('heightFt');
            const weight = this.getNumericValue('weight');
            return heightFt > 0 && weight > 0;
        }
    }

    getNumericValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? parseFloat(element.value) || 0 : 0;
    }

    calculateBMI(isRealTime = false) {
        console.log('Calculating BMI...', { isRealTime });
        
        if (!isRealTime) {
            this.showLoading(true);
        }

        try {
            const { height, weight } = this.getInputValues();
            console.log('Input values:', { height, weight });

            if (!height || !weight || height <= 0 || weight <= 0) {
                console.log('Invalid inputs');
                if (!isRealTime) {
                    this.showToast('Please enter valid height and weight values', 'error');
                    this.showLoading(false);
                }
                return;
            }

            const bmi = weight / (height * height);
            const category = this.getBMICategory(bmi);
            
            console.log('BMI calculated:', bmi, 'Category:', category.category);
            
            this.displayResults(bmi, category);
            this.updateProgressBar(bmi);
            this.showHealthTips(category);
            
            if (!isRealTime) {
                this.addToHistory(bmi, category, height, weight);
                this.showToast('BMI calculated successfully!', 'success');
            }
            
        } catch (error) {
            console.error('Calculation error:', error);
            if (!isRealTime) {
                this.showToast('Error calculating BMI', 'error');
            }
        } finally {
            if (!isRealTime) {
                this.showLoading(false);
            }
        }
    }

    getInputValues() {
        let height, weight;

        if (this.currentUnit === 'metric') {
            height = this.getNumericValue('height') / 100; // cm to m
            weight = this.getNumericValue('weight'); // kg
        } else {
            const heightFt = this.getNumericValue('heightFt');
            const heightIn = this.getNumericValue('heightIn');
            height = (heightFt * 12 + heightIn) * 0.0254; // to meters
            weight = this.getNumericValue('weight') * 0.453592; // lbs to kg
        }

        return { height, weight };
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return this.bmiCategories[0];
        if (bmi < 25) return this.bmiCategories[1];
        if (bmi < 30) return this.bmiCategories[2];
        return this.bmiCategories[3];
    }

    displayResults(bmi, category) {
        console.log('Displaying results...');
        
        const resultsSection = document.getElementById('results');
        const bmiValue = document.getElementById('bmiValue');
        const bmiCategoryEl = document.getElementById('bmiCategory');
        const bmiDescription = document.getElementById('bmiDescription');
        const idealWeightRange = document.getElementById('idealWeightRange');

        if (!resultsSection) {
            console.error('Results section not found');
            return;
        }

        if (bmiValue) bmiValue.textContent = bmi.toFixed(1);
        if (bmiCategoryEl) {
            bmiCategoryEl.textContent = category.category;
            bmiCategoryEl.style.backgroundColor = category.color;
            bmiCategoryEl.style.color = '#fff';
        }
        if (bmiDescription) bmiDescription.textContent = category.description;

        // Calculate ideal weight range
        const { height } = this.getInputValues();
        const minIdealWeight = 18.5 * height * height;
        const maxIdealWeight = 24.9 * height * height;
        
        if (idealWeightRange) {
            if (this.currentUnit === 'metric') {
                idealWeightRange.textContent = `${minIdealWeight.toFixed(1)} - ${maxIdealWeight.toFixed(1)} kg`;
            } else {
                const minLbs = minIdealWeight * 2.20462;
                const maxLbs = maxIdealWeight * 2.20462;
                idealWeightRange.textContent = `${minLbs.toFixed(1)} - ${maxLbs.toFixed(1)} lbs`;
            }
        }

        resultsSection.classList.remove('hidden');
        resultsSection.style.display = 'block';
        console.log('Results displayed');
    }

    updateProgressBar(bmi) {
        const progressIndicator = document.getElementById('progressIndicator');
        if (!progressIndicator) return;

        let position = 0;
        if (bmi < 18.5) {
            position = Math.min(bmi / 18.5 * 18.5, 18.5);
        } else if (bmi < 25) {
            position = 18.5 + ((bmi - 18.5) / (25 - 18.5)) * 6.5;
        } else if (bmi < 30) {
            position = 25 + ((bmi - 25) / (30 - 25)) * 5;
        } else {
            position = Math.min(30 + ((bmi - 30) / 20) * 70, 100);
        }

        progressIndicator.style.left = `${position}%`;
    }

    showHealthTips(category) {
        const tipsContent = document.getElementById('tipsContent');
        if (!tipsContent) return;

        const tipsList = document.createElement('ul');
        tipsList.className = 'tips-list';

        category.tips.forEach(tip => {
            const listItem = document.createElement('li');
            listItem.textContent = tip;
            tipsList.appendChild(listItem);
        });

        tipsContent.innerHTML = '';
        tipsContent.appendChild(tipsList);
    }

    addToHistory(bmi, category, height, weight) {
        const historyItem = {
            bmi: bmi.toFixed(1),
            category: category.category,
            color: category.color,
            height: this.currentUnit === 'metric' ? 
                (height * 100).toFixed(0) + ' cm' : 
                this.formatImperialHeight(height),
            weight: this.currentUnit === 'metric' ? 
                weight.toFixed(1) + ' kg' : 
                (weight * 2.20462).toFixed(1) + ' lbs',
            date: new Date().toLocaleDateString(),
            unit: this.currentUnit
        };

        this.history.unshift(historyItem);
        
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }

        this.updateHistoryDisplay();
    }

    formatImperialHeight(heightInMeters) {
        const totalInches = heightInMeters / 0.0254;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}' ${inches}"`;
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No calculations yet. Calculate your BMI to see history.</p>';
            return;
        }

        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-details">
                    <div class="history-bmi" style="color: ${item.color}">
                        BMI: ${item.bmi} (${item.category})
                    </div>
                    <div class="history-inputs">
                        Height: ${item.height}, Weight: ${item.weight}
                    </div>
                </div>
                <div class="history-date">${item.date}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    toggleHistory() {
        console.log('Toggling history...');
        
        const historyToggle = document.getElementById('historyToggle');
        const historyContent = document.getElementById('historyContent');
        
        if (!historyToggle || !historyContent) {
            console.error('History elements not found');
            return;
        }

        const isExpanded = historyToggle.getAttribute('aria-expanded') === 'true';
        console.log('Current state:', isExpanded ? 'expanded' : 'collapsed');
        
        historyToggle.setAttribute('aria-expanded', (!isExpanded).toString());
        
        if (isExpanded) {
            // Collapse
            historyContent.style.display = 'none';
            historyContent.classList.add('hidden');
        } else {
            // Expand  
            historyContent.style.display = 'block';
            historyContent.classList.remove('hidden');
        }
        
        console.log('History toggled to:', isExpanded ? 'collapsed' : 'expanded');
    }

    resetForm() {
        console.log('Resetting form...');
        this.resetInputs();
        this.clearErrors();
        this.hideResults();
        this.showToast('Form reset successfully!', 'success');
    }

    resetInputs() {
        const inputs = ['height', 'weight', 'heightFt', 'heightIn'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
            }
        });
    }

    hideResults() {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
            resultsSection.style.display = 'none';
        }
        
        const tipsContent = document.getElementById('tipsContent');
        if (tipsContent) {
            tipsContent.innerHTML = '<p>Calculate your BMI to receive personalized health tips based on your results.</p>';
        }
    }

    showLoading(show) {
        const calculateBtn = document.getElementById('calculateBtn');
        if (!calculateBtn) return;

        const spinner = calculateBtn.querySelector('.btn-spinner');
        
        if (show) {
            if (spinner) spinner.classList.remove('hidden');
            calculateBtn.disabled = true;
        } else {
            if (spinner) spinner.classList.add('hidden');
            calculateBtn.disabled = false;
        }
    }

    showToast(message, type = 'success') {
        console.log('Showing toast:', message, type);
        
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.error('Toast container not found');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }

    clearErrors() {
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing BMI Calculator');
    new BMICalculator();
});