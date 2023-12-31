---
id: 5900f4051000cf542c50ff18
title: 'Завдання 153: вивчення цілих гаусових чисел'
challengeType: 1
forumTopicId: 301784
dashedName: problem-153-investigating-gaussian-integers
---

# --description--

Як відомо, рівняння $x^2 = -1$ не має розв’язків за дійсного значення $x$.

Якщо підставити уявне число $i$, то рівняння матиме два розв’язки: $x = i$ та $x = -i$.

Якщо піти далі, рівняння ${(x - 3)}^2 = -4$ матиме два складні розв’язки: $x = 3 + 2i$ та $x = 3 - 2i$, які називають комплексно спряженими.

Числа $a + bi$ називаються комплексними числами.

$a + bi$ та $a − bi$ є комплексно спряженими. Ціле гаусове число є комплексним числом $a + bi$ таким чином, що $a$ та $b$ є цілими числами.

Звичайні цілі числа також є цілими гаусовими числами (за умови $b = 0$).

Щоб відрізнити такі числа від простих гаусових чисел де $b ≠ 0$, їх називають «раціональними цілими числами».

Ціле гаусове число називається дільником раціонального цілого числа $n$, якщо результат також є цілим гаусовим числом.

Наприклад, якщо поділити 5 на $1 + 2i$, можемо спростити наступним чином:

Помножте чисельник та знаменник на комплексне спряжене значення $1 + 2i$: $1 − 2i$.

Отримаємо:

$$\frac{5}{1 + 2i} = \frac{5}{1 + 2i} \frac{1 - 2i}{1 - 2i} = \frac{5(1 - 2i)}{1 - {(2i)}^2} = \frac{5(1 - 2i)}{1 - (-4)} = \frac{5(1 - 2i)}{5} = 1 - 2i$$

Отже, $1 + 2i$ є дільником 5.

Зверніть увагу, що $1 + i$ не є дільником 5, оскільки:

$$\frac{5}{1 + i} = \frac{5}{2} - \frac{5}{2}i$$

Зверніть увагу: якщо ціле гаусове число ($a + bi$) є дільником раціонального цілого числа $n$, то комплексне спряжене ($a − bi$) також буде дільником $n$. Фактично у числа 5 є шість дільників з додатною дійсною частиною: {1, 1 + 2i, 1 − 2i, 2 + i, 2 − i, 5}.

Нижче наведена таблиця всіх дільників для перших п’яти додатних раціональних цілих чисел:

| n | Дільники цілих гаусових чисел з додатною дійсною частиною | Сума s(n) цих дільників |
| - | --------------------------------------------------------- | ----------------------- |
| 1 | 1                                                         | 1                       |
| 2 | 1, 1 + i, 1 - i, 2                                        | 5                       |
| 3 | 1, 3                                                      | 4                       |
| 4 | 1, 1 + i, 1 - i, 2, 2 + 2i, 2 - 2i, 4                     | 13                      |
| 5 | 1, 1 + 2i, 1 - 2i, 2 + i, 2 - i, 5                        | 12                      |

Для дільників з додатною дійсною частиною отримаємо: $\displaystyle\sum_{n=1}^5 s(n) = 35$.

За умови $1 ≤ n ≤ {10}^5$, $\displaystyle\sum_{n = 1}^{{10}^5} s(n) = 17924657155$.

Чому дорівнює $\displaystyle\sum_{n=1}^{{10}^8} s(n)$?

# --hints--

`sumGaussianIntegers()` має повернути `17971254122360636`.

```js
assert.strictEqual(sumGaussianIntegers(), 17971254122360636);
```

# --seed--

## --seed-contents--

```js
function sumGaussianIntegers() {

  return true;
}

sumGaussianIntegers();
```

# --solutions--

```js
// solution required
```
