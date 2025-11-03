class CreatePaymentMethods < ActiveRecord::Migration[7.2]
  def change
    create_table :payment_methods do |t|
      t.references :user, null: false, foreign_key: true
      t.string :card_last4
      t.string :card_brand
      t.integer :exp_month
      t.integer :exp_year
      t.string :stripe_payment_method_id

      t.timestamps
    end
  end
end
