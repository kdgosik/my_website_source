# my_website_source
[kdgosik.netlify.com](https://kdgosik.netlify.com/)



## Using Markdown/Hugo
[Reference](https://gohugo.io/documentation/)

```
hugo new --kind post <post>/<yyyy-mm-dd>-<new_post_name>

## or

hugo new --kind tutorial <tutorial>/<yyyy-mm-dd>-<new_post_name>
```
  - Run above command to generate <yyyy-mm-dd>-<new_post_name>.md file
  - Edit <yyyy-mm-dd>-<new_post_name>.md file to make your tutorial or blog
  - Run <code>hugo</code> to rebuild website
  - Run <code>hugo -D serve</code> to serve on localhost:1313 and check it out


## Using RMarkdown/blog_down
[Reference](https://bookdown.org/yihui/blogdown/)

```
## command line
 R -e 'blogdown::new_post("new title")'

## within R/Rstudio
blogdown::new_post("new title")
```
    - Run above command to generate <yyyy-mm-dd>-<new_post_name>.Rmd file
    - Edit <yyyy-mm-dd>-<new_post_name>.Rmd file to make your tutorial or blog
    - Run <code>blogdown::build_site()</code> to rebuild website
    - Run <code>hugo -D serve</code> to serve on localhost:1313 and check it out



## Using Jupyter
[Reference](https://sourcethemes.com/academic/docs/jupyter/)

```
hugo new --kind post <post>/<yyyy-mm-dd>-<new_post_name>

## or

hugo new --kind tutorial <tutorial>/<yyyy-mm-dd>-<new_post_name>

cd content/<post|tutorial>/<yyyy-mm-dd>-<new_post_name>

jupyter nbconvert <notebook_file>.ipynb --to markdown --NbConvertApp.output_files_dir=.

# Copy the contents of Untitled.md and append it to index.md:
cat <notebook_file>.md | tee -a index.md

# Remove the temporary file:
rm <notebook_file>.md
```
  - Run above command to generate <yyyy-mm-dd>-<new_post_name>.md file
  - Run <code>hugo</code> to rebuild website
  - Run <code>hugo -D serve</code> to serve on localhost:1313 and check it out
