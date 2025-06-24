
const Terms = () => {
  return (
    <div className="min-h-screen pt-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using LeadGenAI, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of LeadGenAI materials for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained in the service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Collection and Use</h2>
            <p>
              LeadGenAI collects and processes data for lead generation purposes. You agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data collected will be used solely for lead generation services</li>
              <li>You have the right to use and process the data for legitimate business purposes</li>
              <li>You will comply with all applicable data protection laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer</h2>
            <p>
              The materials on LeadGenAI are provided on an 'as is' basis. LeadGenAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations</h2>
            <p>
              In no event shall LeadGenAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use LeadGenAI materials, even if LeadGenAI or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@leadgenai.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
