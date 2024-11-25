FROM node:18
WORKDIR /app
COPY package.json ./
#COPY package-lock.json ./
COPY ./ ./
#RUN apk add --upgrade xdg-utils
RUN npm -f i
RUN npm -f install react-router-dom --save
#RUN npm run build
#stage-20.244.4.185
#prod - 20.244.3.73
#ENV REACT_APP_USER_SERVICE_API_BASE_URL "http://20.244.4.185:5000"
#ENV REACT_APP_FILE_SERVICE_API_BASE_URL "http://20.244.4.185:80"
#ENV REACT_APP_USER_PROJECT_SERVICE_API_BASE_URL "http://20.244.4.185:6000"
#ENV REACT_APP_SCENE_SERVICE_API_BASE_URL "http://20.244.4.185:7000"
#ENV REACT_APP_THREE_JS_PUBLIC_API_BASE_URL "https://publish.ctruh.org"
#ENV REACT_APP_NODE_API_BASE_URL "http://20.244.4.185:8080"
#ENV REACT_APP_TEXTURE_SERVICE_API_BASE_URL "http://20.244.4.185:4000"
#ENV REACT_APP_DASHBOARD_URL "https://ctruh.org/linkage/dashboard"
#ENV REACT_APP_LOGIN_PAGE_URL "https://ctruh.org/login"
#ENV REACT_APP_HOME_PAGE_URL "https://ctruh.org/"
Expose 8888
CMD ["npm", "run", "start"]
