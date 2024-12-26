---
layout: post
title: The $$q$$-derivative manual
date: 2023-08-07 11:12:00-0400
description: About $$q$$-calculus and $$q$$-multinomial coefficients
tags: formatting math
categories: sample-posts
related_posts: false
---


# 1. The $q$-derivative 



Consider the expression 
\begin{equation}\label{quotient}
\frac{f(x)-f(x_0)}{x-x_0}.
\end{equation}
In analysis, we define the (infinitesimal) derivative as the limit of \eqref{quotient} when $x\to x_0$. However, if we just replace $x$ by $qx$ or $x+h$, withour taking the limit, we enter the world of ``quantum'' calculus ($q$-calculus or $h$-calculus). The case of $h$-calculus correspond to difference equations and won't be treated in this article. We will focus on $q$-calculus, that has rich relations with number theory and the representation theory of quantum groups.

For any  $q\neq 1$, the $q$-derivative of a function $f:\Rr\to \Rr$ is defined as
\begin{equation}
D_q f(x) = \frac{f(qx) - f(x)}{(q-1)x} \equiv \frac{d_q f(x)}{d_qx}.
\end{equation}
Remark that $D_q$ is a linear operator. We work here on the real numbers, but we could use other field (of characteristic $0$, for some constructions bellow); for instance, in representation theory, $q$ is sometimes a  complex root of unity. 

Since $D_q x^n = \frac{q^n - 1}{q-1} x^{n-1}$, we define the $q$-analog of the integer $n$ (a $q$-integer) by
\begin{equation}
[n]:= \frac{q^n - 1}{q-1} = 1 + q + \cdots + q^{n-1}.
\end{equation}
With this notation, $D_qx^n = [n]x^{n-1}$.

The $q$-derivative satisfies a deformed product rule:
\begin{equation}
D_q(f(x)g(x)) = f(qx) (D_qg(x)) + (D_qf(x)) g(x);
\end{equation}
the reader can verify this by direct computation. The commutativity of the product of functions gives a second product rule
\begin{equation}
D_q(f(x)g(x)) = g(qx) (D_qf(x)) + (D_qg(x)) f(x).
\end{equation}
The application of this rule to the equality $g(x) \left(\frac{f(x)}{q(x)}\right) = f(x)$ allows us to deduce a formula for the derivative of a quotient of functions. However, there is no chain rule in $q$-calculus.



# 2. Taylor formula 



The following proposition generalizes the usual Taylor formula.


**Proposition 1** *
Let $a$ be a real number; $D$, a linear operator on $\Rr[x]$ (polynomials with real coefficients), and $\{P_0(x), P_1(x), P_2(x),...\}$, a sequence of polynomials satisfying:


<ol>
<li><a name="condition_evaluation"></a> $P_0(a) = 1, \quad P_n(a)=0 \text{ for all }n\geq 1$.
<li><a name="condition_deg"></a> $\deg P_n = n.$
<li><a name="condition_derivative"></a> $DP_n = P_{n-1}$ for all $n\geq 1$ and $D(1)=0$.

</ol>


Then, for any polynomial $f(x)$ of degree $N$ one has
\begin{equation}
f(x) = \sum_{k=1}^N (D^k f)(a) P_k(x).
\end{equation}
*


The proof of this proposition is relatively simple. By condition \eqref{condition_deg}, the set $\{P_i\}_i$ is a base of $\Rr[x]$. Therefore, $f$ can be expressed as a combination $\sum_{i=0}^N c_k P_k$, where $c_k$ are appropriate constants. To find $c_0$, just evaluate $f$ at $a$ to obtain $c_0 = f(a)$, by condition \eqref{condition_evaluation}. In virtue of \eqref{condition_derivative}, $f'(x) = \sum_{k=1}^N c_k P_{k-1}$, which implies that $c_1 = f'(a)$. By recursion, $c_k = (D^k f)(a)$. 

 Remark that the same reasoning allows us to express any formal series $f$ as an the infinite linear combination $\sum_{k=0}^\infty (D^k f)(a) P_k(x)$; this turns out to be important in the applications to number theory.

The usual Taylor polynomials correspond to the case $D = \frac{d}{dx}$ and $P_n(x) = \frac{(x-a)^n}{n!}$. Of course, we want to set now $D= D_q$... what is the good choice of $P_n$s? If $a=0$, we can simply take $P_n(x) = \frac{x^n}{[n]!}$, where $[n]! = [n][n-1]\cdots [1]$. But, in general, $\frac{(x-a)^n}{[n]!}$ does not give the good solution. It is clear that $P_0(x) = 1$ and $P_1(x) = x-a$; in turn, by conditions \eqref{condition_derivative} and \eqref{condition_evaluation}, this implies that
\begin{equation}
P_2(x) = \frac{x^2}{[2]!} - ax - \frac{a^2}{[2]!} + a^2 = \frac{(x-a)(x-qa)}{[2]!}.
\end{equation}
It turns out that, for $n\geq 1$, the good choice is 
\begin{equation}
P_n(x) := \frac{(x-a)(x-qa)\cdots (x-q^{n-1}a)}{[n]!}.
\end{equation}
Following \cite{Kac}, we will simply write $(x-a)^n_q$ instead of $(x-a)(x-qa)\cdots (x-q^{n-1}a)$; by convention, $(x-a)^0_q = 1$. In the theory of hypergeometric functions, the quantity $(1-a)(1-qa)\cdots (1-q^{n-1}a)$ is denoted $(a;q)_n$ and called ``the $q$-Pochhammer symbol''.


**Proposition 2** *
For $n\geq 1$, $D_q(x-a)^n_q = [n](x-a)_q^{n-1}$.
*

This is proved by induction on $n$. For $(x-a)_q^{n+1} = (x-a)^n_q (x-q^n a)$, the product rule gives

D_q(x-a)_q^{n+1} &= (qx-q^na)D_q(x-a)^n_q + (x-a)^n_q D_q(x-q^na) <br>

& = q(x-q^{n-1}a)[n](x-a)^{n-1}_q + (x-a)^{n}_q<br>

&= (q[n] + 1) (x-a)^{n}_q = (q(1+\cdots +q^{n-1})+1) (x-a)^{n}_q  <br>

&= [n+1] (x-a)^{n}_q.


Therefore, we conclude that:

**Proposition 3** *
For any polynomial $f(x)$ of degree $N$ and any number $c\in \Rr$, the following $q$-Taylor formula is satisfied:
\begin{equation}\label{taylor}
f(x) =\sum_{i=0}^N (D_q^jf)(c) \frac{(x-c)^j_q}{[j]!}.
\end{equation}
*


Let us apply the formula to $f(x) = (x+a)^n_q$ and $c=0$. We simply replace
\begin{equation}
D_q^jf(0) = [n]\cdots [n-j+1] (0+a)^n_q = [n]\cdots [n-j+1] q^{(n-j)(n-j-1)/2} a^{n-j},
\end{equation}
in \eqref{taylor} and then make the change of variables $k=n-j$ to get the so called \textbf{Gauss binomial formula}:
\begin{equation}
(x+a)^n_q =\sum_{k=0}^n \qbinom n k q^{k(k-1)/2} a^kx^{n-k}.
\end{equation}
The coefficient $\qbinom n k$ equals $\frac{[n]!}{[k]![n-k]!}$ and |naturally| it is called $q$-binomial coefficient (or Gaussian binomial coefficient).

There is another binomial theorem that involves the coefficients $\qbinom nk$. 


**Proposition 4** *<a name="non-comm-binomial-thm"></a>
Suppose that $x, y$ are two variables such that 
\begin{equation}\label{commutator}
yx = qxy.
\end{equation} 
Then,
\begin{equation}
(x+y)^n = \sum_{k=0}^n \qbinom n k x^k y^{n-k}. 
\end{equation}
*


Side note: the real algebra generated by $x$ and $y$ under the relation \eqref{commutator} is called ``the quantum plane''. (Why algebras are planes? Look for ``affine algebraic variety''.)

Proposition <a href="#non-comm-binomial-thm">4</a> can be proved by recursion, using the relation 
\begin{equation}
\qbinom n k = \qbinom{n-1}{k-1} + q^k\qbinom{n-1}{k}.
\end{equation}
In turn, this relation can be easily deduced from the definition of $\qbinom nk$; it is also a consequence of the second combinatorial interpretation of the $q$-binomial coefficients described bellow.



# 3. The $q$-binomial coefficients 



Let us begin by an interpretation of Proposition <a href="#non-comm-binomial-thm">4</a>. Recall that the usual binomial coefficients $\binom nk$ count the number of sequences in $\{x,y\}^n$ such that $x$ appears $k$ times; we call these ``n-sequences of type $k$''. Let us imagine each $x$ as a horizontal unitary vector in the plane, pointing to the right; each $y$ as a vertical unitary vector, pointing up; and the concatenation of symbols (from left to right) as concatenation of the corresponding arrows. Then an $n$-sequence of type $k$ can be interpreted as a path from $(0,0)$ to $(k,n-k)$. For example, the sequence $xyxx$ is
\[
\begin{tikzcd}
                  & (1,1) \ar[r, "x"] & (2,1) \ar[r, "x"] & (3,1)   \\
(0,0) \ar[r, "x"] & (1,0) \ar[u, "y"] &  &
\end{tikzcd}
\]
Moreover, two different sequences always give two different paths. The paths from $(0,0)$ to $(k,n-k)$ that just move rightward and upward, and the $n$-sequences of type $k$ are in bijection; any of these sets has cardinality $\binom nk$.

The $q$-binomial works similarly, but now you have to keep track of any permutations between $x$ and $y$. Given an $n$-sequence of type $k$, say $s$, let $A(s)$ denote the area between the line $x=k$, the line $y=0$ and the path represented by the sequence $s$. For example, $A(x^k y^{n-k})=0$.
Any other path can be transformed into this path, but any time you turn 
\begin{equation}\label{trans_area}
\begin{tikzcd}
 \bullet \ar[r, "x"] & \bullet \\
 \bullet \ar[u, "y"] &  
\end{tikzcd}
\quad \text{into} \quad
\begin{tikzcd}
                  & \bullet  \\
\bullet \ar[r, "x"] &\bullet \ar[u, "y"]  
\end{tikzcd}
\end{equation}
you have to multiply by $q$; this means that $q$ keeps track of a unit of area that you lost when you turned $yx$ into $xy$. In general, any $n$-sequence $s$ of type $k$ can be transformed into $x^ky^{n-k}$ through the iterated application of the transformation \eqref{trans_area}; at the end, you find $s=q^{A(s)}x^k y^{n-k}$. 

The discussion above implies that \textbf{$\qbinom nk$ is a polynomial in $q$, and the coefficient of the power $q^A$ counts the number of $n$-sequences of type $k$ that determine an area $A$. }

There is another combinatorial interpretation for the $q$-binomial coefficients; as far as we know, this interpretation is completely unrelated to the previous one. 


**Proposition 5** *<a name="subspaces"></a>
Let $q$ be a prime power. The coefficient $\qbinom nk$ counts the number of $k$ dimensional vector subspaces of $\Ff_q^n$.
*


<em>Proof:</em> 
Note that $\Ff_q^n$ has $q^n$ points. If $k=0$, then $\qbinom n 0 = 1$ counts the only space of dimension $0$. When $k\geq 1$, to build a $k$-dimensional subspace, pick first a vector $v_1\neq 0$ ($q^n-1$ possibilities), then a vector $v_2$ independent of $v_1$ ($q^n-q$ possibilities, that correspond to the vectors outside $\langle v\rangle$), and continue this way up to $v_k$ ($q^n-q^{k-1}$ possibilities). This means that there are 
\begin{equation}\label{number_LI}
(q^n-1)(q^n-q)\cdots(q^n-q^{k-1})
\end{equation}
ways of choosing $k$ independent vectors. But different collection of vectors can give the same subspace (we are double-counting). To count the number of subspaces, we must divide \eqref{number_LI} by the number of bases of a $k$-dimensional subspace. This cardinality is obtained by the same reasoning (pick a first element of the base, then a second independent of the first one...). Therefore,
\begin{equation}
(\text{number of }k\text{ dimensional subspaces} = \frac{(q^n-1)(q^n-q)\cdots(q^n-q^{k-1}) }{(q^k-1)(q^k-1)\cdots (q^k-q^{k-1})} = \qbinom nk.
\end{equation}
$latex \Box&fg=000000$



As promised, the Pascal relation
\begin{equation}
\qbinom n k = \qbinom{n-1}{k-1} + q^k\qbinom{n-1}{k}.
\end{equation}
can be deduced from the following observation: let $\{e_1,...,e_n\}$ be a base of $\Ff_q^n$ and identify $\Ff_q^{n-1}$ with $\langle e_1,...,e_{n-1}\rangle$; a $k$ dimensional subspace is either 


<ul>
<li> $W\oplus \langle e_n\rangle$, with $W$ a $k-1$ dimensional subspace of $\Ff_q^{n-1}$;
<li> The graph of a $k$ dimensional space $W'$ contained in $\Ff_q^{n-1}$; there are $q^k$ different linear applications that can be defined on $W'$ (the cardinality of the dual of $\Ff_q^{k}$).

</ul>



Some final remarks: Proposition <a href="#subspaces">5</a> show a very strong analogy between the counting of subsets of a set of cardinality $n$ and the counting of subspaces of $\Ff_q^n$. One could wonder in which sense an $n$-element set is like $\Ff_1^n$. Of course, there is no field of characteristic one, but there are very good reasons to give mathematical content to this analogy. One of these reason is that $\Zz$ is expected to be a $\Ff_1$-algebra, and therefore $\operatorname{Spec}(\Zz)$ could be thought as a ``curve'' over $\Ff_1$. Many people hope that we will be able to reproduce the proof of the Weil conjecture (developed mainly by Grothendieck and Deligne) to prove the Riemann hypothesis. Connes and Consani have defined the ``arithmetic site'' to move in this direction.

There is a context in which the analogy between sets and spaces can be made precise. Proposition <a href="#subspaces">5</a> can be modified to prove that $\qbinom{n+1}{k+1}$ count the number of $k$ dimensional subspaces of $\mathbb P^n(F_q)$, the projective space. Birkhoff defined axiomatically a ``projective geometry of order $q$'', where one can find the known projective spaces $\mathbb P^n(F_q)$ as particular examples of order $q$. The Boolean algebra of a finite set is a projective geometry of order $1$.  Just from the axioms, one can prove the analogous of Proposition <a href="#subspaces">5</a>, and the counting of subsets of a set sits simply as a particular case. See \cite{cohn2004projective}.



\bibliographystyle{abbrv}
\bibliography{bibtex}

