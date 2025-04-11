import {Calculator} from './Calculator';

describe('Test suite for Calculator.ts', () => {
  let calculator;
  beforeAll(() => {
    let inputResult = document.createElement("input");
    inputResult.type = "text";
    inputResult.id = 'dashboard'
    inputResult.className = "app-result";

    document.body.appendChild(inputResult);

    calculator = new Calculator()
    calculator.dashboard = inputResult;
  });

  it('printDigit should to be defined', () => {
    expect(calculator.printDigit).toBeDefined();
  });

  it('printDigit should add new value', () => {
    calculator.dashboard.value = '';
    calculator.printDigit('5');
    calculator.printDigit('5');
    expect(calculator.dashboard.value).toBe('55');
  });

  it('printDigit should to be call in calculator.paste', () => {
    localStorage.setItem('result', '7');
    const onSpy = jest.spyOn(calculator, 'printDigit');
    calculator.paste();
    expect(onSpy).toHaveBeenCalledWith('7');
  });

  it('printAction should to be defined', () => {
    expect(calculator.printAction).toBeDefined();
  });

  it('clr should clear dashboard value', () => {
    calculator.dashboard.value = '123';
    calculator.clr();
    expect(calculator.dashboard.value).toBe('');
  });

  it('solve should evaluate the expression and display result', () => {
    calculator.dashboard.value = '2+3*2';
    calculator.solve();
    expect(calculator.dashboard.value).toBe('8');
  });

  it('printAction +/- should toggle sign', () => {
    calculator.dashboard.value = '99';
    calculator.printAction('+/-');
    expect(calculator.dashboard.value).toBe('-99');
    calculator.printAction('+/-');
    expect(calculator.dashboard.value).toBe('99');
  });

  it('printAction should not add action if last char is already an action', () => {
    calculator.dashboard.value = '5+';
    calculator.printAction('*');
    expect(calculator.dashboard.value).toBe('5+');
  });

  it('printAction should not add action if dashboard is empty', () => {
    calculator.dashboard.value = '';
    calculator.printAction('+');
    expect(calculator.dashboard.value).toBe('');
  });

  it('printAction should add action if conditions allow', () => {
    calculator.dashboard.value = '6';
    calculator.printAction('-');
    expect(calculator.dashboard.value).toBe('6-');
  });

  it('setTheme should set body class and localStorage', () => {
    calculator.setTheme('theme-one');
    expect(document.body.className).toBe('theme-one');
    expect(localStorage.getItem('theme')).toBe('theme-one');
  });

  it('toggleTheme should change theme after timeout (real timer)', (done) => {
    localStorage.setItem('theme', 'theme-one');
    calculator.toggleTheme();

    setTimeout(() => {
      expect(localStorage.getItem('theme')).toBe('theme-second');
      expect(document.body.className).toBe('theme-second');
      done();
    }, 600);
  });

  it('toggleTheme should call setTheme via setTimeout (fake timer)', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(calculator, 'setTheme');
    localStorage.setItem('theme', 'theme-one');

    calculator.toggleTheme();
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledWith('theme-second');
    expect(localStorage.getItem('theme')).toBe('theme-second');

    calculator.setTheme('theme-second');
    expect(document.body.className).toBe('theme-second');

    jest.useRealTimers();
  });

  it('toggleTheme switches from theme-second to theme-one', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(calculator, 'setTheme');

    localStorage.setItem('theme', 'theme-second');
    calculator.toggleTheme();

    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledWith('theme-one');

    jest.useRealTimers();
  });

  it('save should write result to localStorage', () => {
    calculator.dashboard.value = '12345';
    calculator.save();
    expect(localStorage.getItem('result')).toBe('12345');
  });

  it('paste should restore saved value to dashboard', () => {
      localStorage.setItem('result', '789');
      calculator.clr();
      calculator.paste();
      expect(calculator.dashboard.value).toBe('789');
    });
  });
