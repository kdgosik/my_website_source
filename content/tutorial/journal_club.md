---
title: Journal Club
author: Kirk Gosik
date: "2019-02-15T10:14:45-05:00"
draft: false
linktitle: Journal Club
menu:
  tutorial:
    parent: Journal Club
    weight: 1
categories: ["python"]
tags: ["python", "autoencoder"]
image:
  caption: ''
  focal_point: ''
toc: true
type: docs
---


## SAUCIE Journal Club
  - [Reference](https://www.krishnaswamylab.org/projects/saucie/)
  - [Biorxiv](https://www.biorxiv.org/content/biorxiv/early/2019/01/03/237065.full.pdf)

**Exploring Single-Cell Data with Deep Multitasking Neural Networks**

Preivew of the paper on biorxiv.

![saucie](https://raw.githubusercontent.com/kdgosik/my_website_source/master/static/img/SAUCIE_ScreenShot.png)

### Description

Our unsupervised architecture, called SAUCIE (Sparse Autoencoder for Unsupervised Clustering, Imputation, and Embedding), simultaneously performs several key tasks for single-cell data analysis including 1) clustering, 2) batch correction, 3) visualization, and 4) denoising/imputation. SAUCIE is trained to recreate its own input after reducing its dimensionality in a 2-D embedding layer which can be used to visualize the data.

Additionally, SAUCIE uses two novel regularizations: (1) an information dimension regularization to penalize entropy as computed on normalized activation values of the layer, and thereby encourage binary-like encodings that are amenable to clustering and (2) a Maximal Mean Discrepancy penalty to correct batch effects. Thus SAUCIE has a single architecture that denoises, batch-corrects, visualizes and clusters data using a unified representation. We show results on artificial data where ground truth is known, as well as mass cytometry data from dengue patients, and single-cell RNA-sequencing data from embryonic mouse brain.

#### Architecture

SAUCIE consists of three encoding layers, an embedding layer, and then three decoding layers.

#### Training

To perform multiple tasks, SAUCIE uses a single architecture as described above, but is run
and optimized sequentially. The first run imputes noisy values and corrects batch effects in the
original data. This preprocessed data is then run through SAUCIE again to obtain a visualization
and to pick out clusters.

The loss function of all runs starts with a reconstruction loss Lr forcing the autoencoder to
learn to reconstruct its input at the end. SAUCIE uses the standard mean-squared error loss (i.e.,

$$L_{r}(X, \hat{X}) = \frac{1}{n}\Sigma^{n}_{i=1}||x_i − \hat{x_{i}}||^2$$



### Four key tasks:

  1. visualization and dimensionality reduction,
  2. batch correction,
  3. clustering, and
  4. denoising and imputation.

![SAUCIE_ScreenShot2](https://github.com/kdgosik/my_website_source/blob/master/static/img/SAUCIE_ScreenShot2.png?raw=true)

  #### Visualization/Dimensionality Reduction

2-D bottleneck used as embeddings for visualization.  

This regularization is computed from the visualization layer to ensure consistency across subsampled batches. The resulting total loss is then,
$$ L = L_r(X, \hat{X}) + \lambda_b · L_b(V )$$

#### Batch Correction
(page13-14, 22 and 26-27)


The batch correction term $L_b$ calculates the Maximal Mean Discrepancy (MMD) between batches, as

$$L_b = \Sigma_{i\neq{ref}}MMD(V_{ref} , V_i),$$

where $V_{ref}$ is the visualization layer of one of the replicates, arbitrarily chosen to be considered as a reference batch

#### Clustering
(page 27)

The loss function of the clustering run then optimizes $L_r$ along with two regularization terms $L_c$ and $L_d$ that together enable SAUCIE to learn clusters:

$$L = L_r(\hat{X}, \tilde{X}) + \lambda_c · L_c(B) + \lambda_d · L_d(B, \hat{X})$$


The two regularizations $\lambda_d$ and $\lambda_c$ affect the number of clusters that result. For a given value
of $\lambda_d$, as $\lambda_c$ increases, the number of clusters decreases (coarser granularity). Higher values of $\lambda_d$ yield more clusters (finer granularity). Notably, these results are robust and yield reasonable
results for varying values of the two regularizations.


#### Denoising/Imputation

### Download Code

There is not packages to install.  It is tensorflow code that is on the github page for the lab.  You are able to download a zip file of the repository and save it to a directory called code.  We will reference this for the functions to run SAUCIE.


```
## Get code from github and download to code directory
!mkdir code
!wget https://github.com/KrishnaswamyLab/SAUCIE/archive/master.zip -O code/master.zip
!cd code; unzip master.zip
!cd ..
```

### Download 10x PBMC data

We will use the PBMC data from the 10x website as our test data.  You can download this and place it in a directory called data.  


```
!mkdir data
!wget https://s3-us-west-2.amazonaws.com/10x.files/samples/cell/pbmc3k/pbmc3k_filtered_gene_bc_matrices.tar.gz -O data/pbmc3k_filtered_gene_bc_matrices.tar.gz
!cd data; tar -xzf pbmc3k_filtered_gene_bc_matrices.tar.gz
!cd ..
```

### Requirements

You will also need to have the following python modules installed to run this.
```
## Python3
scanpy
louvain
tensorflow 1.4.0
numpy 1.13.3
scipy 1.1.0
```
**Note:** all requirements automatically satisfied in colab.research.google.com except for scanpy and louvain.  


```
%%time
## this takes about 5 minutes
## installing scanpy and louvain
!pip install scanpy louvain
```


```
#!/bin/usr/python3

import scanpy.api as sc
import numpy as np
import pandas as pd
import scipy.io
import sys

## switch to code path to load module
sys.path.insert(0, 'code/SAUCIE-master')

from model import SAUCIE
from loader import Loader
```


```
adata = sc.read_10x_mtx(
    './data/filtered_gene_bc_matrices/hg19/',  # the directory with the `.mtx` file
    var_names='gene_symbols')                  # use gene symbols for the variable names (variables-axis index)
```


```
## checking shape of data
adata.X
```


```
## transform to numpy array for running the model
## cells by genes

data_np = adata.X.toarray()
initial_index = adata.obs.index
gene_names = adata.var_names
```


```
## making sure shape is the same
data_np.shape
```

## Scanpy/Seurat Tutorial of PBMC
[Reference](https://scanpy-tutorials.readthedocs.io/en/latest/pbmc3k.html)

### Preprocess


```
adata.var_names_make_unique()  # this is unnecessary if using 'gene_ids'

# basic filtering
sc.pp.filter_cells(adata, min_genes=200)
sc.pp.filter_genes(adata, min_cells=3)


# identifying mito genes
mito_genes = adata.var_names.str.startswith('MT-')
# for each cell compute fraction of counts in mito genes vs. all genes
# the `.A1` is only necessary as X is sparse (to transform to a dense array after summing)
adata.obs['percent_mito'] = np.sum(
    adata[:, mito_genes].X, axis=1).A1 / np.sum(adata.X, axis=1).A1
# add the total counts per cell as observations-annotation to adata
adata.obs['n_counts'] = adata.X.sum(axis=1).A1

## filtering out lowly expressed genes
adata = adata[adata.obs['n_genes'] < 2500, :]
adata = adata[adata.obs['percent_mito'] < 0.05, :]

## normalize data
sc.pp.normalize_per_cell(adata, counts_per_cell_after=1e4)
sc.pp.log1p(adata)

adata.raw = adata
```


```
## identifying and filtering to highly variable genes
sc.pp.highly_variable_genes(adata, min_mean=0.0125, max_mean=3, min_disp=0.5)
adata = adata[:, adata.var['highly_variable']]

## regressing out umi and mito
sc.pp.regress_out(adata, ['n_counts', 'percent_mito'])

## scaling gene expressiong data
sc.pp.scale(adata, max_value=10)
```

### PCA


```
sc.tl.pca(adata, svd_solver='arpack')

```

### Neighborhood Graph


```
sc.pp.neighbors(adata, n_neighbors=10, n_pcs=40)
```

### Cluster


```
sc.tl.louvain(adata)
```


```
sc.tl.paga(adata)
sc.pl.paga(adata, plot=False)  # remove `plot=False` if you want to see the coarse-grained graph
sc.tl.umap(adata, init_pos='paga')
```

### Identify Cell Types


```

new_cluster_names = [
    'CD4 T', 'CD14+ Monocytes',
    'B', 'CD8 T',
    'NK', 'FCGR3A+ Monocytes',
    'Dendritic', 'Megakaryocytes']
adata.rename_categories('louvain', new_cluster_names)
```


```
## Plotting with UMAP
sc.pl.umap(adata, color = 'louvain', legend_loc = 'on data')
```

## SAUCIE

### Input Parameters

```

SAUCIE(input_dim,
        lambda_b=0,
        lambda_c=0,
        layer_c=0,
        lambda_d=0,
        layers=[512,256,128,2],
        activation=lrelu,
        learning_rate=.001,
        restore_folder='',
        save_folder='',
        limit_gpu_fraction=.3,
        no_gpu=False):
```

        """
        The SAUCIE model.
        :param input_dim: the dimensionality of the data
        :param lambda_b: the coefficient for the MMD regularization
        :param lambda_c: the coefficient for the ID regularization
        :param layer_c: the index of layer_dimensions that ID regularization should be applied to (usually len(layer_dimensions)-2)
        :param lambda_d: the coefficient for the intracluster distance regularization
        :param activation: the nonlinearity to use in the hidden layers
        :param loss: the loss function to use, one of 'mse' or 'bce'
        :param learning_rate: the learning_rate to use while training
        :param restore_folder: string of the directory where a previous model is saved, if present will return a new Python object with the old SAUCIE tensorflow graph
        :param save_folder: string of the directory to save SAUCIE to by default when save() is called)
        """

### Training on PBMC Data


```
%%time
## takes about 35 minutes on just CPU runtime at 1000 steps
## takes less than 1 minutes with GPU runtime at 1000 steps. scales linearly, eg. 10000 steps ~ 10 minutes

## https://github.com/KrishnaswamyLab/SAUCIE#usage
saucie = SAUCIE(input_dim = data_np.shape[1],
                lambda_b=0, # default: 0
                lambda_c=0, # default: 0
                layer_c=0, # default: 0
                lambda_d=0, # default: 0
                layers=[512,256,128,2], # default: [512,256,128,2]
                activation='lrelu', # default: lrelu
                learning_rate=.001, # defaul: .001
                restore_folder='', # defaul: ''
                save_folder='', # default: ''
                limit_gpu_fraction=.3, # default .3
                no_gpu=False) # default: False
loadtrain = Loader(data_np, shuffle=True)
saucie.train(loadtrain, steps=1000)
```

### Loading Output


```
## Load results
loadeval = Loader(data_np, shuffle=False)
embedding = saucie.get_embedding(loadeval)
number_of_clusters, clusters = saucie.get_clusters(loadeval)
reconstruction = saucie.get_reconstruction(loadeval)
```

When creating this notebook and keeping the parameter settings the same, I go several different number of clusters each time.  This ranged from 1 cluster, the full dataset, up to 9 clusters.  It seems to be very inconsistent with how many clusters it chooses.  You can try and use the reqularization parameters to help with the tuning and selecting of clusters.  


```
## Joining Embeddings from model
adata.obs = adata.obs.join(pd.DataFrame(embedding, index = initial_index, columns =['SAUCIE1', 'SAUCIE2']))
```


```
## make cluster an integer value
clusters = [int(c) for c in clusters]

## Joining Cluster labels
adata.obs = adata.obs.join(pd.DataFrame(clusters, index = initial_index, columns = ['SAUCIE_Cluster'], dtype = 'category'))

## gives an error related to pandas.  Does not effect any of the output.
```


```
adata.obs
```


```
## getting the reconstruction (imputed/denoised) data
reconstruction_df = adata.obs.join(pd.DataFrame(reconstruction, index = initial_index, columns = gene_names), how='left')
```


```
## only selecting the highly variable genes that were chosen from above
reconstruction_df = reconstruction_df[adata.var_names]
```


```
## checking shape matches
reconstruction_df.shape
```


```
## checking shape matches
adata.X.shape
```


```
## storing the reconstructiong values in the adata layers and naming it SAUCIE
adata.layers['SAUCIE'] = reconstruction_df.values
```

#### Second Round
(page 29)

To perform multiple tasks, SAUCIE uses a single architecture as described above, but is run and optimized sequentially. The first run imputes noisy values and corrects batch effects in the original data. This preprocessed data is then run through SAUCIE again to obtain a visualization and to pick out clusters.

This goes through the same steps above but adding the suffix '_recon' to differentiate between the two outputs.


```
## https://github.com/KrishnaswamyLab/SAUCIE#usage
saucie_recon = SAUCIE(input_dim = reconstruction.shape[1],
                lambda_b=0, # default: 0
                lambda_c=0, # default: 0
                layer_c=0, # default: 0
                lambda_d=0, # default: 0
                layers=[512,256,128,2], # default: [512,256,128,2]
                activation='lrelu', # default: lrelu
                learning_rate=.001, # defaul: .001
                restore_folder='', # defaul: ''
                save_folder='', # default: ''
                limit_gpu_fraction=.3, # default .3
                no_gpu=False) # default: False
loadtrain_recon = Loader(reconstruction, shuffle=True)
saucie_recon.train(loadtrain_recon, steps=1000)
```


```
## Load results
loadeval_recon = Loader(reconstruction, shuffle=False)
embedding_recon = saucie_recon.get_embedding(loadeval_recon)
number_of_clusters_recon, clusters_recon = saucie_recon.get_clusters(loadeval_recon)
reconstruction_recon = saucie_recon.get_reconstruction(loadeval_recon)
```


```
## Joining Embeddings from model
adata.obs = adata.obs.join(pd.DataFrame(embedding_recon, index = initial_index, columns =['SAUCIE1_recon', 'SAUCIE2_recon']))
```


```
## make cluster an integer value
clusters_recon = [int(c) for c in clusters_recon]

## Joining Cluster labels
adata.obs = adata.obs.join(pd.DataFrame(clusters_recon, index = initial_index, columns = ['SAUCIE_Cluster_recon'], dtype = 'category'))

## gives an error related to pandas.  Does not effect any of the output.
```


```
reconstruction_df = adata.obs.join(pd.DataFrame(reconstruction_recon, index = initial_index, columns = gene_names), how='left')
reconstruction_df = reconstruction_df[adata.var_names]
adata.layers['SAUCIE_recon'] = reconstruction_df.values
```

## Compare Clustering


Lots of varying results with the clustering.  This happens to be the latest run.  It seems to be the best of what I have seen so far as well.

### Louvain Labels vs SAUCIE Clusters (w/o imputation)


```
pd.crosstab(adata.obs.louvain, adata.obs.SAUCIE_Cluster)
```

### Louvain Labels vs SAUCIE Clusters using Imputation as input


```
pd.crosstab(adata.obs.louvain, adata.obs.SAUCIE_Cluster_recon)
```

### SAUCIE Clusters (w/o imputation) vs SAUCIE Clusters (w imputation)


```
pd.crosstab(adata.obs.SAUCIE_Cluster, adata.obs.SAUCIE_Cluster_recon)
```

## Compare Visualizations

### SAUCIE w/o Imputation


```
sc.pl.scatter(adata, 'SAUCIE1', 'SAUCIE2', color = 'SAUCIE_Cluster')
```

### SAUCIE w/ Imputation


```
sc.pl.scatter(adata, 'SAUCIE1_recon', 'SAUCIE2_recon', color = 'SAUCIE_Cluster_recon')
```

### Comparing Clusters on UMAP Dimensions


```
sc.pl.umap(adata, color = ['louvain', 'SAUCIE_Cluster', 'SAUCIE_Cluster_recon'])
```


```

```
