TOPDIR=$(PWD)
WHOAMI=$(shell whoami)

run:
	node pull.js

image:
	docker build -t ${WHOAMI}/ghpstats .

image-push: image
	docker push ${WHOAMI}/ghpstats

image-run: image
	docker run -ti -v ${TOPDIR}/data:/usr/src/app/data ${WHOAMI}/ghpstats