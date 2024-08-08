class ApiFeatures {
    constructor(query, queryReq) {
      this.query = query;
      this.queryReq = queryReq;
    }

    populate(field){
        this.query = this.query.populate(field)
        return this
    }
    

    filter() {
      const excludedFields = ["sort", "page", "limit", "fields"];
      let queryObj = { ...this.queryReq };
      console.log(queryObj);
      excludedFields.forEach((el) => {
        delete queryObj[el];
      });
      let queryStr = JSON.stringify(queryObj);  
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
        console.log(match);
        return `$${match}`;
      });
      queryObj = JSON.parse(queryStr);
     this.query = this.query.find(queryObj);
      return this
    }
 
    sort(){
      if(this.queryReq.sort){
          const sortBy = this.queryReq.sort.split(',').join(' ')
          this.query = this.query.sort(sortBy)
      }else{
          this.query = this.query.sort('-createdAt')
      }
      return this
    }
  
    limiting(){
      if(this.queryReq.fields){
          const limitedFields = this.queryReq.fields.split(',').join(' ')
          this.query = this.query.select(limitedFields)
      }else{
          this.query = this.query.select('-__v')
      }
      return this
    }
  
    paginate(){
          const page = this.queryReq.page * 1 || 1
          const limit = this.queryReq.limit * 1 || 100
          const skip = (page - 1) * limit
          this.query = this.query.skip(skip).limit(limit)
          return this
    }
  }
  
  module.exports=ApiFeatures;