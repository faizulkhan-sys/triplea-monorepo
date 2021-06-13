run:
	make -j 2 producer consumer
.PHONY: dev

producer:
	NODE_ENV=${env} npm run --prefix ./packages/employee-triple-a/producer/ start:dev 
.PHONY: producer

consumer:
	NODE_ENV=${env} npm run --prefix ./packages/employee-triple-a/consumer/ start:dev 
.PHONY: consumer
