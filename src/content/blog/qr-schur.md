---
title: QR ~ Schur ~ Simultaneous Iteration
date: 2026-09-13
summary: QR Algorithm interpretation.
---

### Introduction

My intention in writing this post is to give an intuitive explation of the [QR algorithm](https://en.wikipedia.org/wiki/QR_algorithm) (not to be confused with the [QR decomposition](https://en.wikipedia.org/wiki/QR_decomposition)) -- the numerical linear algebra algorithm most widely used to calculate the eigenvalues and eigenvectors of  an arbitrary matrix in the computer. 

It is in the [top 10 list of most important algorithms of the XX century](https://www.computer.org/csdl/magazine/cs/2000/01/c1022/13rRUxBJhBm) together with the FFT, the Simplex Method, QuickSort and the Monte Carlo simulation. It was co-discovered by [J.G.F Francis](https://en.wikipedia.org/wiki/John_G._F._Francis) and [V.N. Kublanovskaya](https://es.wikipedia.org/wiki/Vera_Kubl%C3%A1novskaya) in 1961. In fact, calling it the Francis-Kublanovskaya Algorithm or FK Decompostion would be a more appropriate name. 

![Schur form of a polynomial](/images/blog/schur-form-poly.png)

### Scope 

In this post, I will not cover any of the many computational advances that have led to the 
practical use of the QR algorithm. Topics like Wilkinson shifts and Hessenberg Forms are 
out of the scope of this. If your interested in this topics I would reading the fantastic Numerical Linear 
Algebra books by Demmel, and Threfethen & Bau.

### Motivation

There's multiple reasons to write my notes on this algorithm: 

1. Fundamentally, the spectrum of a matrix --its set of eigenvalues--describes the geometric action of it's associated linear transformation in a concise manner. In other words, **the spectrum enables the classification of different matrices**, up to [similarity](https://en.wikipedia.org/wiki/Matrix_similarity). For instance, fractional eigenvalues imply a contraction of the space, and purely imaginary eigenvalues denote a rotation.  Thus, being able to compute the spectrum of a matrix helps understand the matrix better, and opens up many important applications. 
2. **The QR algorithm has a remarkably short description**. It is an iterative algorithm, described as follows: let $A = QR$ be the QR factorization of $A$, then set $A_1 = RQ$, i.e. change the position of the QR factors -- then decompose $A_1$ again..., and continue for $k$ iterations. In other words we have 

$$
\begin{align}
\textrm{Let }A_0 &= A \textrm{ a square matrix in } \mathbb{C}^n \\
A_0 &= Q_0 R_0 \\
A_1 &= R_0 Q_0\\
A_1 &= Q_1 R_1 \\
A_2 &= R_1 Q_1 \\
...\\
A_n &= R_{n-1} Q_{n-1}
\end{align}
$$

 Then $A_n$ will converge to an upper triangular matrix with the spectrum of $A$ in its diagonal. Not only that, but the eigenvectors, can be retrieved using backsubstitution (more on this later). As promised, this algorithm is almost like a haiku. **However**, at first glance, **it is absolutely mysterious *why* iterating the QR factors in reverse order converges to an upper triangular matrix**. One of our aims is to shed light on why we should expect an upper triangular form. 

3. Linked to the former point, there are multiple explanations online, but most are personally unsatisfactory. In other words, from my perspective, the proper explanation of the algorithm remains elusive, or hidden in  math papers and books. Some explanations, like Wikipedia, are too superficial --which is rare for such an important algorithm--and some others are too abstract. There is one notable exception -- the paper ["Understanding the QR algorithm"](https://epubs.siam.org/doi/10.1137/1024100) by David S. Watkins. This post is in a way an expansion of Watkins' paper, with a practical coding flavor. However, Watkins' paper focuses on the connection to the Power Iteration, and merely brushes the deep reasons for why the Schur form is triangular, as it's implied to be figured out by the reader. If you find yourself hooked at some point while reading this post, I would reccommend you to take a read at Watkins' paper (and his [book](https://www.wiley.com/en-us/shop/general-introductory-mathematics/fundamentals-of-matrix-computations-3rd-edition-p-9780470528334) !) and try to figure it out for yourself.  

### Takeway: QR algorithm ~ Schur Decomposition ~ Simultaneous iteration

In brief, as the title of the post suggests, the Watkins' paper shows that **the QR algorithm is equivalent to Simultaneous iteration**. We will show that **it is also equivalent to the Schur Decomposition**. In fact, the QR algorithm is an efficient method to compute the Schur decomposition. I would argue that in fact, together with the LU (Gaussian) factorization, the QR factorization (i.e. Gram-Schmidt), and the Singular Value decomposition--**the Schur decomposition should be an essential matrix factorization technique taught in a Linear Algebra course**. Let me go ahead and state it. 

**Theorem. Schur decomposition**

Let $A$ be a matrix in $\mathbb{C}^n$. Then, there exists a unitary matrix $Q$ and an upper triangular matrix $U$ (called the Schur matrix) such that: 
$$
A = QUQ^{*}
$$


In other words, any matrix $A$ is unitarily similar to an upper triangular matrix. 

Now note that, since $U$ is triangular, one can solve the homogenous equation 
$$
(U - \lambda_i I)v_i = 0
$$
using [backsubstitution](https://en.wikipedia.org/wiki/Triangular_matrix#Forward_and_back_substitution) to get $U = V \Lambda V^{-1}$ 

Note also that
$$
A = QV \Lambda V^{-1}Q^*
$$
or in words: the eigenbasis of $A$ is $QV$. 

---

Let's think about the implicatons of the theorem. 

First, geometrically, the Schur theorem tells us that we can always find an upper triangular matrix version of any linear transformation $A$, using an orthogonal change of basis. So any matrix can be expressed as a very particular squishing or [*shear*](https://en.wikipedia.org/wiki/Shear_mapping) of the space  under an appropriate perspective using a rotation as an intermediate. Thus, the Schur theorem has a flavor similar to the Spectral theorem, but it's far more general as it applies to *any* matrix, not just to the subset of symmetric matrices, which only has dimension $n \, + \,{n\choose2}$.  

Moreover, it is known that [normal matrices](https://en.wikipedia.org/wiki/Normal_matrix) have an orthogonal set of eigenvectors. Since diagonal matrices are a subset of upper triangular matrices, we have that for normal matrices, the Schur matrix $U$ will coincide with the diagonal matrix of eigenvalues $\Lambda$. 

Conversely, for a more general, diagonalizable matrix $A$, its eigenbasis $V$ will be some non-singular matrix, not necessarily orthogonal. Thus, the Schur basis $Q$ of such matrices will not generally encode an eigenbasis, but rather, a **basis of [invariant subspaces](https://en.wikipedia.org/wiki/Invariant_subspace) of $A$** (more on this later). Notice that there's a tradeoff between eigendecomposition and Schur decomposition for such general matrices: 

* Both decompositions grant you the spectrum. 
* Eigendecomposition gives you also a diagonal (*uncorrelated*) matrix of eigenvalues, but the eigenbasis will be *correlated*. 
* Schur decomposition gives you a *correlated* matrix of eigenvalues (triangular matrix), but the set of  invariant subspaces related to each eigenvalue will be uncorrelated (orthogonal).

# Theory 

### But, why does the QR algorithm converges to an upper triangular matrix ? 

See here is where the things get *really* interesting. To answer the question we'll need to understand the nature of the Schur form. Everything rests on the notion of **invariant subspaces.** 

###     Invariant subspaces and eigenspaces

**Definition. Invariant Subspace.** Let $A$ be a complex, $n \times n$ matrix. Let $S$ be a subspace of $\mathbb{C}^n$. 

We say $S$ is *invariant* to $A$ if the following holds: 
$$
\begin{align}
S \mathrm{\, invariant \ to \, } A \iff \forall x \in S, Ax \in S
\end{align}
$$

Or in other words 
$$
AS \sub S
$$


---

**Examples**

* The kernel of A: trivially, if $x \in \mathrm{ker} A \implies Ax=0 \in \mathrm{ker} A $ so $\mathrm{ker} A $ is an invariant to $A$. 
* The image of A: if $y \in \mathrm{im} A \implies \exists x : Ax = y$, and $Ay$ is a linear combination of columns of $A \implies $ $Ay \in \mathrm{im} A$ . Thus $\mathrm{im} A$ is invariant to $A$. 
* Eigenspaces of $A$: perhaps the *purest* form of invariant subspaces, as $A$ just *scales* any vector in the eigenspace, it doesn't change it's direction. 
* If $A$ is non-singular, the whole of $\mathbb{R}^n$ is invariant to $A$ trivially. 
* $\mathbb{R}^2$ is an invariant subspace of a $2 \times 2$ rotation matrix. 

---



Thus invariant subspaces w.r.t. $A$, are, in a sense, a generalized version of eigenspaces: subspaces that are *unchanged* by the action of $A$, in the sense of a vector subspace as an algebraic structure. 

Let's explore this notion of invariance from the eigendecomposition equation: 
$$
AV = V \Lambda
$$
which is the matrix form of the eigenvalue equation: $A v_i = \lambda_i v_i$. 

**The Schur decomposition** equation: 
$$
AQ=QU
$$
tells us that we have *nested* invariance: allow us for an abuse of notation to let $Q_j = [ q_1 ... q_j ]$ to denote the set of first $j$ columns of matrix $Q$. Now note that that: 
$$
AQ_{j} = Q_{j} U_{jj} \in \mathrm{span} \, Q_{j}
$$
where $U_{jj}$ is the $j x j$ square matrix corresponding to the first $j$ rows and columns, since: 
$$
AQ_{j} = \left[ u_{11}q_1 ,\, u_{12}q_1 + u_{22} q_2 ,\, \ldots,\, \sum_i u_{ij}q_j \right] \in \mathrm{span} Q_{j}
$$
In fact the upper triangular form is the most general form -- it implies a full set of invariant basis vectors. A less constrictive form is to have an **upper triangular *block*** form.

**Lemma (Watkins 6.13)** 

Let $S$ be a subspace of $R^n$ with a basis $\{ \vec{x_1}, ..., \vec{x_k}\}$, i.e. $S  = \mathrm{span}\, (\vec{x_1}, ..., \vec{x_k})$. Now let $X = \left [ \vec{x_1}, ..., \vec{x_k}\right]$. Then $S$ is invariant to an $n\times n$ matrix $A$  iff there is a $k \times k$ matrix $B$ such that
$$
AX=XB
$$


*Proof*: 

($\impliedby$)Assume $\exists B$ s.t. $AX = XB$, then 
$$
A\vec{x_j} = Xb_j = \sum_{i=1}^k b_{ij} \vec{x_i} \in \mathrm{span} (\vec{x_1}, \vec{x_2}, ... \vec{x_k})
$$
since $X$ is a basis of $S$, this implies that $S$ is invariant to $A$.

($\implies$) Moreover, if we assume that $S$ is invariant to $A$, we need to construct coefficients $b_{ij}$ such that if we write $A\vec{x_j} = \sum_{i=1}^k b_{ij}\vec{x_i}$. Define $B_{ij} = b_{ij}$ and thus: 
$$
A \left[ \vec{x_1}, ..., \vec{x_k} \right] = \left[ \vec{x_1}, ..., \vec{x_k} \right] B
$$
$\blacksquare$

**Lemma (Watkins, 6.16)** 

Let $S$ be an invariant subspace to $A$. Assume $S$ has dimension $k$,  with $1 \leq k \leq n$, and $\{ x_1, ..., x_k\}$ be a basis of $S$. Also let $ \{x_{k+1}, ..., x_{n} \}$ be [an extension to a basis of $R^n$](https://www.homepages.ucl.ac.uk/~ucahmto/0005_2021/Ch4.S12.html). 

If we define $B = X^{-1} A X$ , then $B$ is [block upper triangular](https://en.wikipedia.org/wiki/Block_matrix#Block_triangular_matrices). 

*Proof*: 

We aim to show that 
$$
B = \begin{bmatrix} B_{11} & B_{12} \\ B_{21} & B_{22} \end {bmatrix}
$$
with $B_{21} = \mathbf0$.

Consider $AX=XB$ and the equation $Ax_j = Xb_j = \sum_{i=1}^k b_{ij} x_i$ for $j \in \{ 1,...,k \}$. Since $S$ is invariant to $A \implies \, Ax_j \in \mathrm{span} (x_1, ..., x_k)$. But note that we don't need coefficients $b_{ij}$ for $i>k$ to express $Ax_j \implies b_{ij} = 0,\, \forall i > k, j \in \{ 1, .., k\}$. 

Since $B$ is unique as a representation of $A$ in the basis $X \implies \, B_{21}$  is a zero matrix. This shows that $B$ is block upper triangular $\blacksquare$. 

---

Both of these Lemmas give a solid ground for a constructive proof of the Schur Decomposition.

***Proof of the Schur Decomposition.***

Recall that $A$ is a complex $n \times n$ matrix. We aim to show that there exists a decomposition $A = QUQ^*$, such that $Q$ is unitary and $U$ upper triangular. We will prove this by induction. 

Since every matrix $A$ has an eigenvalue, let this be $\lambda$ and its corresponding eigenspace be $V_\lambda$,  and let $V_\lambda^\perp$  be its orthogonal complement. For simplicity assume $\mathrm{dim} V_\lambda = 1$. Let $Q_1$ be an $n\times n$ unitary matrix whose first column $v_1$ is the unit eigenvector spanning $V_\lambda$, and extend to a basis of $\mathbb{C}^n$ by using Gram-Schmidt with $v_\lambda$ as the first basis vector. Note that in this way we get a basis for $V_\lambda$  and $V_\lambda^\perp$.  By the Lemma above, since $V_\lambda$ is an invariant subspace, we have that $Q_1^* A Q_1 = B_1$ is a block triangular matrix of the form 

$$
B_1 = \begin{bmatrix}
\lambda_1 & C_1 \\ 
\mathbf{0} & D_1
\end{bmatrix}
$$

In particular, the first column holds since $v_1^*Av_1 = \lambda_1$ since $||v_1||=1$, and $u^*Av_1=\lambda_1 u^* v_1 = 0$ for any $u \in V_\lambda^\perp$.

Assume $Q_k^* A Q_k = B_k$ for $1<k<n$, with $Q_k$ unitary and $B_k$ block upper triangular. We will show the equation holds for $k+1$. Further, assume that $B_k$ factorizes as 
$$
B_k = Q_k^*AQ_k =
\begin{bmatrix}
T_k & C_k \\
0 & D_k
\end{bmatrix},
$$

with $T_k$ upper triangular. 

Applying the same procedure to $D_k$, to get a unitary $W$ such that

$$
W^*D_kW =
\begin{bmatrix}
\lambda_{k+1} & * \\
0 & D_{k+1}
\end{bmatrix}.
$$

using the Gram-Schmidt process with the first vector to be the eigenvector corresponding to the largest eigenvalue of $D_k$.

Set $Q_{k+1} = Q_k \begin{bmatrix}I_k & 0\\ 0 & W \end{bmatrix}$, which is unitary, as [unitary matrices form a group](https://en.wikipedia.org/wiki/Unitary_group).
By block matrix multiplication, we have that
$$
\begin{aligned}
B_{k+1}
&= Q_{k+1}^*AQ_{k+1} \\
&=
\begin{bmatrix}
I_k & 0 \\
0 & W^*
\end{bmatrix}
Q_k^*AQ_k
\begin{bmatrix}
I_k & 0 \\
0 & W
\end{bmatrix} \\
&=
\begin{bmatrix}
I_k & 0 \\
0 & W^*
\end{bmatrix}
\begin{bmatrix}
T_k & C_k \\
0 & D_k
\end{bmatrix}
\begin{bmatrix}
I_k & 0 \\
0 & W
\end{bmatrix} \\
&=
\begin{bmatrix}
T_k & C_k \\
0 & W^*D_k
\end{bmatrix}
\begin{bmatrix}
I_k & 0 \\
0 & W
\end{bmatrix} \\
&=
\begin{bmatrix}
T_k & C_k W \\
0 & W^*D_k W
\end{bmatrix} \\
&=
\begin{bmatrix}
T_k & * & * \\
0 & \lambda_{k+1} & * \\
0 & 0 & D_{k+1}
\end{bmatrix}
\end{aligned}
$$
Since the leading $(k+1)\times(k+1)$ block is upper triangular, we have completed the proof by induction.

Continuing with this procedure, one can see that, in at most $(n-1)$ steps, we arrive at a limiting upper triangular matrix $B \rightsquigarrow U $, with a change of basis matrix $Q$ that is unitary.$\blacksquare$ 

---

**Notes**

* From the perspective of the theorem, note that, the Schur decomposition says that for any operator $A$, there exists a nested sequence of invariant subspaces of $A$ --also called a or [flag](https://en.wikipedia.org/wiki/Flag_(linear_algebra)) or more generally a [filtration](https://en.wikipedia.org/wiki/Filtration_(mathematics))-- $\{  \mathbf 0\} \subset V_0 \subset V_1 \subset ... \subset V_n = \mathbb{C}^n$ and that there exists an orthonormal basis for this filtration. 
* The property above stems from the "correlation" imposed by the triangular form. This is why the eigenvectors are invariant subspaces *independently* of each other, while **for Schur the invariant subspaces come in a *nested sequence*.**
* We proved this for a general matrix with complex entries. When working only with real coefficients, the Schur form will have a quasi-upper triangular form, with 2 x 2 blocks occuring for complex eigenvalues. 

---

Having established the notion of the **invariant subspaces**, it is not a crazy idea to think that, **after applying the matrix many many times to a random subspace, the subspace will converge to something akin to an invariant space, if it ceases to change numerically.** In fact it is precisely this idea which ties the whole story together: 

> The QR algorithm is just the Power Method applied to a set of $n$ vectors with intermediate orthonormalization.

We now have all the necessary theoretical machinery to understand the QR algorithm. 

# Computation

## Background: Gimme Tha Power 

For our discussion it will be very useful to have a good understanding of the so called Power Method. It is a surprisingly simple method to compute the *dominant* eigenpair, that is, the eigenvalue of largest **magnitude** and its corresponding eigenvector, the [**Perron-Frobenius vector**](https://en.wikipedia.org/wiki/Perron%E2%80%93Frobenius_theorem). 

 **Theorem. Power Method**

Let $A$ be a diagonalizable matrix in $M(\mathbb{R},n)$. Let $x$ be a vector in $\mathbb{R}^n$. 

Then the sequence
$$
Ax,A^2x,A^3x,...
$$


converges to the eigenvector $v_1$ associated with the largest eigenvalue. 

*Proof*:

Write $x$ in the eigenbasis of $A$:
$$
x = c_1 v_1 + c_2 v_2 + ... + c_n v_n
$$
for some nonzero coefficients $c_i$. Assume $|\lambda_1| > |\lambda_2| > ... |\lambda_n|$. Then apply $A$ on both sides of the eqn: 
$$
\begin{align}
Ax &= c_1 Av_1 + ... + c_n Av_n\\
   &= c_1 \lambda_1 v_1 + ... + c_n \lambda_n v_n
\end{align}
$$
Where the first line follows by "linearity", and the second line by the eigenvalue equation. Then write the $k-$th iteration and divide both sides of the equation by $\lambda_1^k$
$$
\begin{align}
\frac{1}{\lambda_1^k} A^k x &= c_1 v_1 + \frac{\lambda_2 ^k}{\lambda_1^k} c_2 v_2 + ... + \frac{\lambda_n^k}{\lambda_1^k} c_n v_n\\
\implies A^k &\approx v_1 \, \mathrm{ for \, large \,} k
\end{align}
$$
since we assumed $\lambda_1$ to be the eigenvalue with the largest magnitude. $\blacksquare$

In practice, we normalize the vector after each matvec. 

```python
import numpy as np
la = np.linalg

def power_method(A:np.ndarray, n_iter:int = 10000, rnd_seed:int=5):
    """
    Returns dominant (eigval, eigenvec) pair for a square matrix A.
    """
    n = len(A)
    rng = np.random.default_rng(seed=rnd_seed)
    x = rng.normal(size = (n,1))
    for i in range(n_iter): 
        x = np.dot(A,x)
        x = x / la.norm(x)
    eigval = x.T@A@x # Rayleigh quotient
    return eigval, x.T
  
rng = np.random.default_rng(seed=5)
n=3
A=rng.normal(size=(n,n))
G=A.T@A # Gram matrix to avoid complex eigenvalues
lambdas,V=la.eig(G)
lambda_1, v_1 = power_method(G)
# note output vectors share the same span (entries may have signs flipped)
print(v_1)    # power method's Perron eigenvec
print(V[:,0]) # numpy's eig Perron eigenvec
```



---

**Question:** Can you deduce for which group of matrices this algorithm won't work ? *Hint*: Think of the action of a matrix geometrically. 

---

**Note**: A nice thing about the Power Method is that, in theory, one can use it to get all the eigenpairs by subtracting the eigenspace, e.g. you can get the second eigenpair by applying the power method to the matrix $A - \lambda_1 v_1 v_1 ^T$.

---

### Subspace (simultaneous) iteration (SI)

SI extends the idea of the [Power Method](https://en.wikipedia.org/wiki/Power_iteration) to a set of $k$ vectors: let $S$ be a set of $k$ linearly independent vectors, and suppose $A$ is a  matrix. Then the sequence: 
$$
AS, A^2S, A^3S ...A^nS
$$
converges to $V$, the invariant subspace spanned by the eigenvectors of $A$. 

In practice, it is crucial that we orthonormalize the basis using Gram-Schmidt (QR) after each iteration to avoid the collapse onto the dominant eigenvector. In fact this QR normalization step creates the connection to the Francis-Kublanovskaya algorithm.

---

### Back to the QR Algorithm 

Now note that we can re-write the QR algorithm from the top as follows: 
$$
\begin{align}
A_0 &= Q_0 R_0 \implies R_0 = Q_0^T A_0 \\
A_1 &= R_0 Q_0 \\
    &= Q_0^T A_0 Q_0 \\ 
    &= Q_1 R_1 \implies R_1 = Q_1^T A_1 = Q_1^T (Q_0^T A_0 Q_0) \\
A_2 &= R_1 Q_1 \\
    &= Q_1^T Q_0^T A_0 Q_0 Q_1\\
\implies A_k &= Q_{k-1}^T ... Q_1^T Q_0^T A Q_0 Q_1 ...Q_{k-1}\\
\\
A_k &= \tilde Q_{(k-1)}^T A \tilde Q_{(k-1)} \quad \tilde{Q}_{k-1} = Q_0 Q_1 \cdots Q_{k-1},\quad
\end{align}
$$
i.e. the QR algorithm is a unitary similarity transformation. Therefore, the claim that $A_k$ reaches an upper triangular form would imply that the QR algorithm effectively *computes* the Schur decomposition.

### Connection of the Simultaneous Iteration with the QR algorithm

But also note that using the intermediate factors on powers of $A$ we get: 
$$
\begin{aligned}
A &= Q_0 R_0 \\[6pt]
A^2
&= Q_0 \underbrace{R_0 Q_0}_{A_1} R_0
 = Q_0 A_1 R_0
 = Q_0 Q_1 R_1 R_0 \\[6pt]
A^3
&= \underbrace{Q_0 Q_1 R_1 R_0}_{A^2}
   \underbrace{Q_0 R_0}_{A} \\
&= Q_0 Q_1 R_1 \underbrace{R_0 Q_0}_{A_1} R_0 \\
&= Q_0 Q_1 \underbrace{R_1 Q_1}_{A_2 = Q_2 R_2} R_1 R_0 \\
&= Q_0 Q_1 Q_2 R_2 R_1 R_0 \\[6pt]
A^k
&= \underbrace{Q_0 Q_1 \cdots Q_{k-1}}_{\tilde{Q}_{k-1}}
   \underbrace{R_{k-1} \cdots R_1 R_0}_{\tilde{R}_{k-1}}
 = \tilde{Q}_{k-1}\tilde{R}_{k-1}.
\end{aligned}
$$
so we can see that the QR factors of powers of $A$ and in the Francis-Kublanovskaya algorithm coinicide. 


---

### Equivalence of the Schur decomposition, Simultaneous Iteration, and QR algorithm in python

Let us show the equivalence with code. 

```python
import numpy as np
import numpy.linalg as la
norm,inv=la.norm, la.inv

def qr_iteration(A,k_iters=100):
    for i in range(k_iters):
        Q,R=la.qr(A)
        A=R@Q
    return A
  
def gram_schmidt(A_): 
    """Returns (Q,R) according to Modified Gram-Schmidt"""
    m,n=np.shape(A_)
    Q, R = np.zeros((m,n), dtype=np.float64), np.zeros((n,n), dtype=np.float64)
    A=np.copy(A_)
    for i in range(n): 
        R[i,i] = norm(A[:, i])
        if R[i,i]==0: 
            raise ValueError("rk deficient matrix, returing QR early")
        else: 
            Q[:, i] =  A[:,i] / norm(A[:, i])
        for j in range(i+1, n): 
            R[i,j] =  A[:, j].dot(Q[:, i])
            A[:,j] = A[:, j] - R[i,j] * Q[:, i]
    return Q,R

def simultaneous_iteration(A,k_iters=100):
    "Returns matrix U after k_iters with simultaneous iteration."
    dim=A.shape[0]
    assert A.shape[1]==dim, "expected square matrix"
    N=np.random.normal(size=(dim,dim))# initialize w/ random vectors
    G=N.T@N
    Q=A@G
    for i in range(k_iters): 
        QQ=A@Q
        Q,_=gram_schmidt(QQ) # orthonormalize with GS
    return inv(QQ)@A@Q # perform change of basis

# Create matrix A according to Schur theorem
t=np.pi/5
Q=np.array([[np.cos(t),-np.sin(t)],[np.sin(t), np.cos(t)]])
U=np.array( [[5, np.pi],[0, 2.1]]) # Schur matrix 
A=Q@U@inv(Q)

U_QR = qr_iteration(A) # Predicted Schur matrix from QR algorithm
U_SI = simultaneous_iteration(A) # Predicted Schur matrix from Simult. Iter.

print(
    "Upper triangular Schur matrix coincide with SI:", 
    np.allclose(U, U_SI)
)

print(
    "Upper triangular Schur matrix coincide with QR algo:", 
    np.allclose(U, U_QR)
)

print(
    "Diagonal of U contains eigvenvalues for SI:", 
    np.allclose(sorted(np.linalg.eigvals(A), reverse=True), np.diag(U_SI))
)

print(
    "Diagonal of U contains eigvenvalues for QR algo:", 
    np.allclose(sorted(np.linalg.eigvals(A), reverse=True), np.diag(U_QR))
)
```

---
### Application: roots of a polynomial

It is well known that the eigenvalues of a [companion matrix](https://en.wikipedia.org/wiki/Companion_matrix) of a monic polynomial coincide with its roots. Thus, we'll use the (real) QR method to get the roots of the following polynomial:  

$$
p(x) = x^{41} + x^3 + 1
$$

The following code reproduces the plot at the beginning of the post. 

```python
import cmath
import matplotlib.pyplot as plt

def make_matrix(coefs):
    """Build a companion matrix from descending coefficients of a monic polynomial."""
    n = len(coefs) - 1
    A = np.diag(np.ones(n - 1), -1)
    for i in range(n):
        A[n - i - 1, -1] = -1 * coefs[i + 1]
    return A


def quad_poly_roots(a, b, c):
    """Return the roots of a real quadratic and a 0/1 real-roots flag."""
    discrim = b**2 - 4 * a * c
    sqrt_discrim = cmath.sqrt(discrim)
    x1 = (-b + sqrt_discrim) / (2 * a)
    x2 = (-b - sqrt_discrim) / (2 * a)
    is_real = 1 if discrim >= 0 else 0
    return x1, x2, is_real

def spectrum_2x2(A):
    """Return the eigenvalues of a real 2x2 matrix and a real-roots flag."""
    [[a, b], [c, d]] = A
    l1, l2, is_real = quad_poly_roots(1, -a - d, a * d - b * c)
    if is_real:
        l1, l2 = l1.real, l2.real
    return (l1, l2), is_real

def extract_eigvals_and_complex_blocks(T):
    """Extract 1x1 eigenvalues and 2x2 blocks from a real Schur form matrix."""
    eigvals = []
    complex_blocks = []
    n = T.shape[0]
    i = 0
    while i < n:
        if i < n - 1 and not np.isclose(T[i + 1, i], 0):
            complex_blocks.append(T[i:i + 2, i:i + 2])
            i += 2
        else:
            eigvals.append(T[i, i])
            i += 1
    return eigvals, complex_blocks

def spectrum_from_schur_form(T):
    """Return eigenvalues extracted from the diagonal blocks of real Schur form."""
    vals, complex_blocks = extract_eigvals_and_complex_blocks(T)
    if len(complex_blocks) > 0:
        for i in range(len(complex_blocks)):
            complex_eigvals, _ = spectrum_2x2(complex_blocks[i])
            vals.extend(complex_eigvals)
    return np.array(vals)


degree=41
coefs = np.zeros(degree + 1)
coefs[0] = 1
coefs[-4] = 1
coefs[-1] = 1
A = make_matrix(coefs)

print(
    f"p(x) = x^{degree} + x^3 + 1, with {len(coefs)} coefficients.\n"
    f"{A.shape[0]}x{A.shape[1]} companion matrix."
)

U = qr_iteration(A,k_iters=10000)

plt.figure(figsize=(3,3))
plt.imshow(U,cmap="PRGn",vmin=-2,vmax=2)
plt.axis("off")
plt.tight_layout()

valls = spectrum_from_schur_form(U)
np_roots = np.poly1d(coefs).r

def sort_complex(z):
    """Order a set of complex numbers canonically, so two sets can be compared."""
    z = np.asarray(z)
    return z[np.lexsort((z.imag, z.real))]

err = np.abs(sort_complex(valls) - sort_complex(np_roots))
print(f"median |np root - eigenvalue| : {np.median(err):.2e}")
```

Let's visually compare the reconstruction of the polynomial using the estimated eigenvalues: 

```python
plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["cmr10"],
    "mathtext.fontset": "cm",
    "axes.formatter.use_mathtext": True,
})

x = np.linspace(-1.2, 1.2, 500)
y = np.linspace(-1.2, 1.2, 500)
X, Y = np.meshgrid(x, y)
Z = X + 1j * Y

H = np.log1p(np.abs(np.polyval(np.poly(valls), Z)))

fig = plt.figure(figsize=(7,5))
ax = fig.add_subplot(111, projection="3d")

surf = ax.plot_surface(
    X, Y, H,
    cmap="viridis",
    rcount=250, ccount=250,
    linewidth=0,
    alpha=0.85,
)

ax.scatter(
    valls.real, valls.imag, np.zeros(len(np_roots)),
    color="black", s=25, depthshade=False, label="QR eigenvalues",
)

ax.set(
    xlabel="$\mathrm{Re}(z)$",
    ylabel="$\mathrm{Im}(z)$",
    zlabel=r"$\log(1+|p(z)|)$",
    title=r"$p(z)=z^{41}+z^3+1$",
)
ax.view_init(elev=35, azim=-60)
ax.legend()
fig.colorbar(surf, ax=ax, shrink=0.6, pad=0.1)
```


![Roots of the polynomial in the complex plane, computed by the QR algorithm and the polynomial surface rebuilt from them](/images/blog/qr-roots-reconstruction.png)

--- 

### References 

David S. Watkins. Fundamentals of Matrix Computations, 3rd Edition. Wiley. 
