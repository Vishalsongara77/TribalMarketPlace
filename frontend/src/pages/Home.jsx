import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiUsers, FiGlobe } from 'react-icons/fi'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Empowering Tribal
              <span className="text-amber-600"> Artisans</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover authentic tribal handicrafts, artworks, and forest products. 
              Support indigenous communities while preserving cultural heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center"
              >
                Shop Now <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/about"
                className="border border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Tribal Marketplace?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We connect you directly with tribal artisans, ensuring fair trade and authentic products.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600">Genuine tribal handicrafts made using traditional techniques passed down through generations.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
              <p className="text-gray-600">Direct connection with artisans ensures fair compensation and supports their communities.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiGlobe className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cultural Preservation</h3>
              <p className="text-gray-600">Every purchase helps preserve traditional crafts and cultural heritage for future generations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Join our community of conscious consumers supporting tribal artisans worldwide.
          </p>
          <Link
            to="/register"
            className="bg-white text-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Get Started <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home